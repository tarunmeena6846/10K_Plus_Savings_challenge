import { randomUUID } from 'crypto';
import { dynamodb } from '../../config/dynamodb';

export interface Tag {
    PK: string; // tag name
    id: string;
    GSI1PK: string;
    tag: string;
    posts: string[]; // post IDs
    createdAt: string;
    updatedAt: string;
}

// Cache to track if GSI index exists (to avoid repeated failed queries)
let tagIdIndexExists: boolean | null = null;

export class TagModel {
    static async create(tagData: Partial<Tag>): Promise<Tag> {
        const now = new Date().toISOString();
        const tagId = randomUUID();
        const tag: Tag = {
            PK: tagData.tag!, // PK is the tag name (primary key)
            id: tagId,
            GSI1PK: tagId!,
            tag: tagData.tag!,
            posts: tagData.posts || [],
            createdAt: now,
            updatedAt: now,
        };

        await dynamodb.put({
            TableName: 'tags',
            Item: tag,
        }).promise();

        return tag;
    }

    static async findByTagId(tagId: string): Promise<Tag | null> {
        try {
                    const scanResult = await dynamodb.scan({
                        TableName: 'tags',
                        FilterExpression: 'GSI1PK = :id',
                        ExpressionAttributeValues: {
                            ':id': tagId,
                        },
                    }).promise();
        
                    return scanResult.Items?.[0] as Tag || null;
                } catch (error: any) {
                    console.error("Error in findByTagIdScan:", error);
                    throw error;
                }
    }

    // // Helper method to find tag by ID using scan (fallback when GSI doesn't exist)
    // private static async findByTagIdScan(tagId: string): Promise<Tag | null> {
    //     try {
    //         const scanResult = await dynamodb.scan({
    //             TableName: 'tags',
    //             FilterExpression: 'GSI1PK = :id',
    //             ExpressionAttributeValues: {
    //                 ':id': tagId,
    //             },
    //         }).promise();

    //         return scanResult.Items?.[0] as Tag || null;
    //     } catch (error: any) {
    //         console.error("Error in findByTagIdScan:", error);
    //         throw error;
    //     }
    // }
    static async findByTagName(tagName: string): Promise<Tag | null> {
        const result = await dynamodb.get({
            TableName: 'tags',
            Key: { PK: tagName }, // PK is the tag name (primary key)
        }).promise();

        return result.Item as Tag || null;
    }

    static async addPost(tagName: string, postId: string): Promise<Tag | null> {
        // Check if tag exists by tag name
        const existingTag = await this.findByTagName(tagName);

        if (!existingTag) {
            // Create new tag if it doesn't exist
            return await this.create({ tag: tagName, posts: [postId] });
        }

        // Tag exists, update the posts array if postId is not already present
        if (!existingTag.posts.includes(postId)) {
            const result = await dynamodb.update({
                TableName: 'tags',
                Key: { PK: tagName }, // PK is the tag name
                UpdateExpression: 'SET posts = list_append(posts, :postId), updatedAt = :updatedAt',
                ExpressionAttributeValues: {
                    ':postId': [postId],
                    ':updatedAt': new Date().toISOString(),
                },
                ReturnValues: 'ALL_NEW',
            }).promise();

            return result.Attributes as Tag;
        }

        // Post already exists in the tag's posts array
        return existingTag;
    }

    static async removePost(tagName: string, postId: string): Promise<Tag | null> {
        const tag = await this.findByTagId(tagName);
        if (!tag) return null;

        const updatedPosts = tag.posts.filter(id => id !== postId);

        if (updatedPosts.length === 0) {
            // Delete tag if no posts left
            await this.delete(tagName);
            return null;
        }

        const result = await dynamodb.update({
            TableName: 'tags',
            Key: { PK: tagName },
            UpdateExpression: 'SET posts = :posts, updatedAt = :updatedAt',
            ExpressionAttributeValues: {
                ':posts': updatedPosts,
                ':updatedAt': new Date().toISOString(),
            },
            ReturnValues: 'ALL_NEW',
        }).promise();

        return result.Attributes as Tag;
    }

    static async findAll(limit: number = 100): Promise<Tag[]> {
        const result = await dynamodb.scan({
            TableName: 'tags',
            Limit: limit,
        }).promise();

        return result.Items as Tag[] || [];
    }

    static async delete(tagName: string): Promise<void> {
        await dynamodb.delete({
            TableName: 'tags',
            Key: { PK: tagName },
        }).promise();
    }
}

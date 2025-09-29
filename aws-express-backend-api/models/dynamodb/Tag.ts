import { dynamodb } from '../../config/dynamodb';

export interface Tag {
    PK: string; // tag name
    SK: string; // TAG
    tag: string;
    posts: string[]; // post IDs
    createdAt: string;
    updatedAt: string;
}

export class TagModel {
    static async create(tagData: Partial<Tag>): Promise<Tag> {
        const now = new Date().toISOString();

        const tag: Tag = {
            PK: tagData.tag!,
            SK: 'TAG',
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

    static async findByTag(tagName: string): Promise<Tag | null> {
        const result = await dynamodb.get({
            TableName: 'tags',
            Key: { PK: tagName, SK: 'TAG' },
        }).promise();

        return result.Item as Tag || null;
    }

    static async addPost(tagName: string, postId: string): Promise<Tag | null> {
        const tag = await this.findByTag(tagName);
        if (!tag) {
            // Create new tag if it doesn't exist
            return await this.create({ tag: tagName, posts: [postId] });
        }

        if (!tag.posts.includes(postId)) {
            const result = await dynamodb.update({
                TableName: 'tags',
                Key: { PK: tagName, SK: 'TAG' },
                UpdateExpression: 'SET posts = list_append(posts, :postId), updatedAt = :updatedAt',
                ExpressionAttributeValues: {
                    ':postId': [postId],
                    ':updatedAt': new Date().toISOString(),
                },
                ReturnValues: 'ALL_NEW',
            }).promise();

            return result.Attributes as Tag;
        }

        return tag;
    }

    static async removePost(tagName: string, postId: string): Promise<Tag | null> {
        const tag = await this.findByTag(tagName);
        if (!tag) return null;

        const updatedPosts = tag.posts.filter(id => id !== postId);

        if (updatedPosts.length === 0) {
            // Delete tag if no posts left
            await this.delete(tagName);
            return null;
        }

        const result = await dynamodb.update({
            TableName: 'tags',
            Key: { PK: tagName, SK: 'TAG' },
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
            FilterExpression: 'SK = :sk',
            ExpressionAttributeValues: {
                ':sk': 'TAG',
            },
            Limit: limit,
        }).promise();

        return result.Items as Tag[] || [];
    }

    static async delete(tagName: string): Promise<void> {
        await dynamodb.delete({
            TableName: 'tags',
            Key: { PK: tagName, SK: 'TAG' },
        }).promise();
    }
}

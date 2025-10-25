import { dynamodb } from '../../config/dynamodb';

export interface Post {
    PK: string; // postId
    SK: string; // POST
    GSI1PK: string; // author
    GSI1SK: string; // createdAt
    GSI2PK: string; // status
    GSI3PK: string; // tag
    title: string;
    content: string;
    author: string;
    createdAt: string;
    comments: string[]; // comment IDs
    isPublished: boolean;
    tag?: string;
    userImage?: string;
    status: 'approvalPending' | 'approved' | 'rejected';
    updatedAt: string;
}

export class PostModel {
    static async create(postData: Partial<Post>): Promise<Post> {
        const postId = `POST#${Date.now()}`;
        const now = new Date().toISOString();

        const post: Post = {
            PK: postId,
            SK: 'POST',
            GSI1PK: postData.author!,
            GSI1SK: now,
            GSI2PK: postData.status || 'approvalPending',
            GSI3PK: postData.tag || 'general',
            title: postData.title!,
            content: postData.content!,
            author: postData.author!,
            createdAt: now,
            comments: postData.comments || [],
            isPublished: postData.isPublished || true,
            tag: postData.tag || 'general',
            userImage: postData.userImage,
            status: postData.status || 'approvalPending',
            updatedAt: now,
        };

        await dynamodb.put({
            TableName: 'posts',
            Item: post,
        }).promise();

        return post;
    }

    static async findById(postId: string): Promise<Post | null> {
        const result = await dynamodb.get({
            TableName: 'posts',
            Key: { PK: postId, SK: 'POST' },
        }).promise();

        return result.Item as Post || null;
    }

    static async findByAuthor(author: string, limit: number = 50): Promise<Post[]> {
        const result = await dynamodb.query({
            TableName: 'posts',
            IndexName: 'AuthorTimeIndex',
            KeyConditionExpression: 'GSI1PK = :author',
            ExpressionAttributeValues: {
                ':author': author,
            },
            ScanIndexForward: false, // Sort by createdAt descending
            Limit: limit,
        }).promise();

        return result.Items as Post[] || [];
    }

    static async findByStatus(status: string, limit: number = 50): Promise<Post[]> {
        const result = await dynamodb.query({
            TableName: 'posts',
            IndexName: 'StatusIndex',
            KeyConditionExpression: 'GSI2PK = :status',
            ExpressionAttributeValues: {
                ':status': status,
            },
            ScanIndexForward: false,
            Limit: limit,
        }).promise();

        return result.Items as Post[] || [];
    }

    static async findByTag(tag: string, limit: number = 50): Promise<Post[]> {
        const result = await dynamodb.query({
            TableName: 'posts',
            IndexName: 'TagIndex',
            KeyConditionExpression: 'GSI3PK = :tag',
            ExpressionAttributeValues: {
                ':tag': tag,
            },
            ScanIndexForward: false,
            Limit: limit,
        }).promise();

        return result.Items as Post[] || [];
    }

    static async findAll(limit: number = 100): Promise<Post[]> {
        const result = await dynamodb.scan({
            TableName: 'posts',
            FilterExpression: 'SK = :sk',
            ExpressionAttributeValues: {
                ':sk': 'POST',
            },
            Limit: limit,
        }).promise();

        return result.Items as Post[] || [];
    }
    static async findByIds(postIds: string[]): Promise<Post[]> {
        const result = await dynamodb.scan({
            TableName: 'posts',
            FilterExpression: 'PK IN (:postIds)',
            ExpressionAttributeValues: {
                ':postIds': postIds,
            },
        }).promise();
        return result.Items as Post[] || [];
    } catch (error: any) {
        console.error(error);
        throw error;
    }

    static async update(postId: string, updateData: Partial<Post>): Promise<Post | null> {
        const updateExpressions: string[] = [];
        const expressionAttributeNames: { [key: string]: string } = {};
        const expressionAttributeValues: { [key: string]: any } = {};

        // Add updatedAt
        updateData.updatedAt = new Date().toISOString();

        // Update GSI keys if relevant fields change
        if (updateData.status) {
            updateExpressions.push('GSI2PK = :status');
            expressionAttributeValues[':status'] = updateData.status;
        }
        if (updateData.tag) {
            updateExpressions.push('GSI3PK = :tag');
            expressionAttributeValues[':tag'] = updateData.tag;
        }

        Object.keys(updateData).forEach((key, index) => {
            if (key !== 'PK' && key !== 'SK' && key !== 'GSI1PK' && key !== 'GSI1SK' &&
                key !== 'GSI2PK' && key !== 'GSI3PK' && updateData[key as keyof Post] !== undefined) {
                updateExpressions.push(`#${key} = :val${index}`);
                expressionAttributeNames[`#${key}`] = key;
                expressionAttributeValues[`:val${index}`] = updateData[key as keyof Post];
            }
        });

        if (updateExpressions.length === 0) {
            return null;
        }

        const result = await dynamodb.update({
            TableName: 'posts',
            Key: { PK: postId, SK: 'POST' },
            UpdateExpression: `SET ${updateExpressions.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW',
        }).promise();

        return result.Attributes as Post;
    }

    static async delete(postId: string): Promise<void> {
        await dynamodb.delete({
            TableName: 'posts',
            Key: { PK: postId, SK: 'POST' },
        }).promise();
    }

    static async addComment(postId: string, commentId: string): Promise<void> {
        await dynamodb.update({
            TableName: 'posts',
            Key: { PK: postId, SK: 'POST' },
            UpdateExpression: 'SET comments = list_append(comments, :commentId)',
            ExpressionAttributeValues: {
                ':commentId': [commentId],
            },
        }).promise();
    }

    static async removeComment(postId: string, commentId: string): Promise<void> {
        const post = await this.findById(postId);
        if (post) {
            const updatedComments = post.comments.filter(id => id !== commentId);
            await dynamodb.update({
                TableName: 'posts',
                Key: { PK: postId, SK: 'POST' },
                UpdateExpression: 'SET comments = :comments',
                ExpressionAttributeValues: {
                    ':comments': updatedComments,
                },
            }).promise();
        }
    }
}

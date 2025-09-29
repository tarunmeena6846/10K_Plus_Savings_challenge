import { dynamodb } from '../../config/dynamodb';

export interface Likes {
    users: string[];
    likes: number;
}

export interface Comment {
    PK: string; // commentId
    SK: string; // COMMENT
    GSI1PK: string; // postId
    GSI1SK: string; // createdAt
    GSI2PK: string; // author
    content: string;
    author: string;
    post: string; // postId
    createdAt: string;
    likes: Likes;
    imageLink?: string;
    parentId?: string;
    updatedAt: string;
}

export class CommentModel {
    static async create(commentData: Partial<Comment>): Promise<Comment> {
        const commentId = `COMMENT#${Date.now()}`;
        const now = new Date().toISOString();

        const comment: Comment = {
            PK: commentId,
            SK: 'COMMENT',
            GSI1PK: commentData.post!,
            GSI1SK: now,
            GSI2PK: commentData.author!,
            content: commentData.content!,
            author: commentData.author!,
            post: commentData.post!,
            createdAt: now,
            likes: commentData.likes || { users: [], likes: 0 },
            imageLink: commentData.imageLink,
            parentId: commentData.parentId,
            updatedAt: now,
        };

        await dynamodb.put({
            TableName: 'comments',
            Item: comment,
        }).promise();

        return comment;
    }

    static async findById(commentId: string): Promise<Comment | null> {
        const result = await dynamodb.get({
            TableName: 'comments',
            Key: { PK: commentId, SK: 'COMMENT' },
        }).promise();

        return result.Item as Comment || null;
    }

    static async findByPost(postId: string, limit: number = 50): Promise<Comment[]> {
        const result = await dynamodb.query({
            TableName: 'comments',
            IndexName: 'PostTimeIndex',
            KeyConditionExpression: 'GSI1PK = :postId',
            ExpressionAttributeValues: {
                ':postId': postId,
            },
            ScanIndexForward: true, // Sort by createdAt ascending
            Limit: limit,
        }).promise();

        return result.Items as Comment[] || [];
    }

    static async findByAuthor(author: string, limit: number = 50): Promise<Comment[]> {
        const result = await dynamodb.query({
            TableName: 'comments',
            IndexName: 'AuthorIndex',
            KeyConditionExpression: 'GSI2PK = :author',
            ExpressionAttributeValues: {
                ':author': author,
            },
            ScanIndexForward: false,
            Limit: limit,
        }).promise();

        return result.Items as Comment[] || [];
    }

    static async findAll(limit: number = 100): Promise<Comment[]> {
        const result = await dynamodb.scan({
            TableName: 'comments',
            FilterExpression: 'SK = :sk',
            ExpressionAttributeValues: {
                ':sk': 'COMMENT',
            },
            Limit: limit,
        }).promise();

        return result.Items as Comment[] || [];
    }

    static async update(commentId: string, updateData: Partial<Comment>): Promise<Comment | null> {
        const updateExpressions: string[] = [];
        const expressionAttributeNames: { [key: string]: string } = {};
        const expressionAttributeValues: { [key: string]: any } = {};

        // Add updatedAt
        updateData.updatedAt = new Date().toISOString();

        Object.keys(updateData).forEach((key, index) => {
            if (key !== 'PK' && key !== 'SK' && key !== 'GSI1PK' && key !== 'GSI1SK' &&
                key !== 'GSI2PK' && updateData[key as keyof Comment] !== undefined) {
                updateExpressions.push(`#${key} = :val${index}`);
                expressionAttributeNames[`#${key}`] = key;
                expressionAttributeValues[`:val${index}`] = updateData[key as keyof Comment];
            }
        });

        if (updateExpressions.length === 0) {
            return null;
        }

        const result = await dynamodb.update({
            TableName: 'comments',
            Key: { PK: commentId, SK: 'COMMENT' },
            UpdateExpression: `SET ${updateExpressions.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW',
        }).promise();

        return result.Attributes as Comment;
    }

    static async delete(commentId: string): Promise<void> {
        await dynamodb.delete({
            TableName: 'comments',
            Key: { PK: commentId, SK: 'COMMENT' },
        }).promise();
    }

    static async addLike(commentId: string, userId: string): Promise<void> {
        const comment = await this.findById(commentId);
        if (comment && !comment.likes.users.includes(userId)) {
            const updatedLikes = {
                users: [...comment.likes.users, userId],
                likes: comment.likes.likes + 1,
            };

            await dynamodb.update({
                TableName: 'comments',
                Key: { PK: commentId, SK: 'COMMENT' },
                UpdateExpression: 'SET likes = :likes, updatedAt = :updatedAt',
                ExpressionAttributeValues: {
                    ':likes': updatedLikes,
                    ':updatedAt': new Date().toISOString(),
                },
            }).promise();
        }
    }

    static async removeLike(commentId: string, userId: string): Promise<void> {
        const comment = await this.findById(commentId);
        if (comment && comment.likes.users.includes(userId)) {
            const updatedLikes = {
                users: comment.likes.users.filter(id => id !== userId),
                likes: Math.max(0, comment.likes.likes - 1),
            };

            await dynamodb.update({
                TableName: 'comments',
                Key: { PK: commentId, SK: 'COMMENT' },
                UpdateExpression: 'SET likes = :likes, updatedAt = :updatedAt',
                ExpressionAttributeValues: {
                    ':likes': updatedLikes,
                    ':updatedAt': new Date().toISOString(),
                },
            }).promise();
        }
    }
}

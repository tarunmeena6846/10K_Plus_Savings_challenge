import { dynamodb } from '../../config/dynamodb';
import { randomUUID } from 'crypto';
export interface Post {
    PK: string; // postId
    id: string;
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
        const postId = randomUUID();
        const now = new Date().toISOString();

        const post: Post = {
            PK: postId,
            id: postId,
            GSI1PK: postData.author!,
            GSI1SK: now,
            GSI2PK: postData.status || 'approvalPending',
            GSI3PK: postData.tag || 'general',
            title: postData.title!,
            content: postData.content!,
            author: postData.author!,
            createdAt: now,
            comments: [],
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
            Key: { PK: postId },
        }).promise();

        return result.Item as Post || null;
    }

    static async findByAuthor(author: string, limit: number = 50, offset: number = 0): Promise<Post[]> {
        let allItems: Post[] = [];
        let lastEvaluatedKey: any = undefined;
        const totalNeeded = offset + limit;

        do {
            const queryParams: any = {
                TableName: 'posts',
                IndexName: 'AuthorTimeIndex',
                KeyConditionExpression: 'GSI1PK = :author',
                ExpressionAttributeValues: {
                    ':author': author,
                },
                ScanIndexForward: false, // Sort by createdAt descending
                Limit: Math.min(1000, totalNeeded - allItems.length),
            };

            if (lastEvaluatedKey) {
                queryParams.ExclusiveStartKey = lastEvaluatedKey;
            }

            const result = await dynamodb.query(queryParams).promise();

            if (result.Items) {
                allItems = allItems.concat(result.Items as Post[]);
            }

            lastEvaluatedKey = result.LastEvaluatedKey;
        } while (lastEvaluatedKey && allItems.length < totalNeeded);

        // Apply offset and limit
        return allItems.slice(offset, offset + limit);
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

    // static async findByTag(tag: string, limit: number = 50): Promise<Post[]> {
    //     const result = await dynamodb.query({
    //         TableName: 'posts',
    //         IndexName: 'TagIndex',
    //         KeyConditionExpression: 'GSI3PK = :tag',
    //         ExpressionAttributeValues: {
    //             ':tag': tag,
    //         },
    //         ScanIndexForward: false,
    //         Limit: limit,
    //     }).promise();

    //     return result.Items as Post[] || [];
    // }

    static async findAll(limit: number = 100, offset: number = 0, status?: string): Promise<Post[]> {
        let allItems: Post[] = [];
        let lastEvaluatedKey: any = undefined;
        const totalNeeded = offset + limit;

        // If status is provided, use the more efficient query on StatusIndex
        if (status) {
            do {
                const queryParams: any = {
                    TableName: 'posts',
                    IndexName: 'StatusIndex',
                    KeyConditionExpression: 'GSI2PK = :status',
                    ExpressionAttributeValues: {
                        ':status': status,
                    },
                    ScanIndexForward: false, // Sort by createdAt descending
                    Limit: Math.min(1000, totalNeeded - allItems.length),
                };

                if (lastEvaluatedKey) {
                    queryParams.ExclusiveStartKey = lastEvaluatedKey;
                }

                const result = await dynamodb.query(queryParams).promise();

                if (result.Items) {
                    allItems = allItems.concat(result.Items as Post[]);
                }

                lastEvaluatedKey = result.LastEvaluatedKey;
            } while (lastEvaluatedKey && allItems.length < totalNeeded);

            // Apply offset and limit (items are already sorted by createdAt descending from the query)
            return allItems.slice(offset, offset + limit);
        }
        return [];
    }
    static async findByIds(postIds: string[], limit: number = 10, offset: number = 0): Promise<Post[]> {
        try {
            // Return empty array if no postIds provided
            if (!postIds || postIds.length === 0) {
                return [];
            }

            // Apply offset to postIds array first (client-side pagination on IDs)
            const paginatedPostIds = postIds.slice(offset, offset + limit);

            // DynamoDB batchGet has a limit of 100 items per request
            const BATCH_SIZE = 100;
            let allPosts: Post[] = [];

            // Process in batches of 100
            for (let i = 0; i < paginatedPostIds.length; i += BATCH_SIZE) {
                const batch = paginatedPostIds.slice(i, i + BATCH_SIZE);

                const result: any = await dynamodb.batchGet({
                    RequestItems: {
                        'posts': {
                            Keys: batch.map(id => ({ PK: id })),
                        },
                    },
                }).promise();

                if (result.Responses?.posts) {
                    allPosts = allPosts.concat(result.Responses.posts as Post[]);
                }

                // Handle unprocessed keys (retry if needed)
                if (result.UnprocessedKeys && Object.keys(result.UnprocessedKeys).length > 0) {
                    // Retry unprocessed keys
                    const retryResult: any = await dynamodb.batchGet({
                        RequestItems: result.UnprocessedKeys,
                    }).promise();

                    if (retryResult.Responses?.posts) {
                        allPosts = allPosts.concat(retryResult.Responses.posts as Post[]);
                    }
                }
            }

            // Return the results (already paginated by offset and limit on the IDs)
            return allPosts;
        } catch (error: any) {
            console.error(error);
            throw error;
        }
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
            if (key !== 'PK' && key !== 'GSI1PK' && key !== 'GSI1SK' &&
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
            Key: { PK: postId },
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
            Key: { PK: postId },
        }).promise();
    }

    static async addComment(postId: string, commentId: string): Promise<void> {
        await dynamodb.update({
            TableName: 'posts',
            Key: { PK: postId },
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
                Key: { PK: postId },
                UpdateExpression: 'SET comments = :comments',
                ExpressionAttributeValues: {
                    ':comments': updatedComments,
                },
            }).promise();
        }
    }
}

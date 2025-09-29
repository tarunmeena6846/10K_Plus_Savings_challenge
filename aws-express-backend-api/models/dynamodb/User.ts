import { dynamodb } from '../../config/dynamodb';

export interface User {
    PK: string; // userId
    SK: string; // USER
    GSI1PK: string; // email
    GSI2PK: string; // username
    username: string;
    email: string;
    password: string;
    isAdmin: boolean;
    resetPasswordToken?: string;
    resetPasswordTokenUsed?: boolean;
    imageUrl?: string;
    verified: boolean;
    stripePlanId?: string;
    stripeUserId?: string;
    isSubscribed?: boolean;
    isTopTier: boolean;
    verificationToken: string;
    myWhy: string;
    swotSessionTime?: string;
    bookmarkedPosts: string[];
    swotTasksDetails?: string;
    myPosts: string[];
    myDrafts: string[];
    videoModalSettings: {
        dashboardVideoModal: boolean;
    };
    createdAt: string;
    updatedAt: string;
}

export class UserModel {
    static async create(userData: Partial<User>): Promise<User> {
        const userId = `USER#${Date.now()}`;
        const now = new Date().toISOString();

        const user: User = {
            PK: userId,
            SK: 'USER',
            GSI1PK: userData.email!,
            GSI2PK: userData.username!,
            username: userData.username!,
            email: userData.email!,
            password: userData.password!,
            isAdmin: userData.isAdmin || false,
            resetPasswordToken: userData.resetPasswordToken,
            resetPasswordTokenUsed: userData.resetPasswordTokenUsed || false,
            imageUrl: userData.imageUrl,
            verified: userData.verified || false,
            stripePlanId: userData.stripePlanId,
            stripeUserId: userData.stripeUserId,
            isSubscribed: userData.isSubscribed || false,
            isTopTier: userData.isTopTier || false,
            verificationToken: userData.verificationToken || '',
            myWhy: userData.myWhy || '',
            swotSessionTime: userData.swotSessionTime,
            bookmarkedPosts: userData.bookmarkedPosts || [],
            swotTasksDetails: userData.swotTasksDetails,
            myPosts: userData.myPosts || [],
            myDrafts: userData.myDrafts || [],
            videoModalSettings: userData.videoModalSettings || { dashboardVideoModal: true },
            createdAt: now,
            updatedAt: now,
        };

        await dynamodb.put({
            TableName: 'users',
            Item: user,
        }).promise();

        return user;
    }

    static async findById(userId: string): Promise<User | null> {
        const result = await dynamodb.get({
            TableName: 'users',
            Key: { PK: userId, SK: 'USER' },
        }).promise();

        return result.Item as User || null;
    }

    static async findByEmail(email: string): Promise<User | null> {
        const result = await dynamodb.query({
            TableName: 'users',
            IndexName: 'EmailIndex',
            KeyConditionExpression: 'GSI1PK = :email',
            ExpressionAttributeValues: {
                ':email': email,
            },
        }).promise();

        return result.Items?.[0] as User || null;
    }

    static async findByUsername(username: string): Promise<User | null> {
        const result = await dynamodb.query({
            TableName: 'users',
            IndexName: 'UsernameIndex',
            KeyConditionExpression: 'GSI2PK = :username',
            ExpressionAttributeValues: {
                ':username': username,
            },
        }).promise();

        return result.Items?.[0] as User || null;
    }

    static async update(userId: string, updateData: Partial<User>): Promise<User | null> {
        const updateExpressions: string[] = [];
        const expressionAttributeNames: { [key: string]: string } = {};
        const expressionAttributeValues: { [key: string]: any } = {};

        // Add updatedAt
        updateData.updatedAt = new Date().toISOString();

        Object.keys(updateData).forEach((key, index) => {
            if (key !== 'PK' && key !== 'SK' && updateData[key as keyof User] !== undefined) {
                updateExpressions.push(`#${key} = :val${index}`);
                expressionAttributeNames[`#${key}`] = key;
                expressionAttributeValues[`:val${index}`] = updateData[key as keyof User];
            }
        });

        if (updateExpressions.length === 0) {
            return null;
        }

        const result = await dynamodb.update({
            TableName: 'users',
            Key: { PK: userId, SK: 'USER' },
            UpdateExpression: `SET ${updateExpressions.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW',
        }).promise();

        return result.Attributes as User;
    }

    static async delete(userId: string): Promise<void> {
        await dynamodb.delete({
            TableName: 'users',
            Key: { PK: userId, SK: 'USER' },
        }).promise();
    }

    static async findAll(limit: number = 100): Promise<User[]> {
        const result = await dynamodb.scan({
            TableName: 'users',
            FilterExpression: 'SK = :sk',
            ExpressionAttributeValues: {
                ':sk': 'USER',
            },
            Limit: limit,
        }).promise();

        return result.Items as User[] || [];
    }
}

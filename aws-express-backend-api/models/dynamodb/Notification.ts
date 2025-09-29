import { dynamodb } from '../../config/dynamodb';

export interface NotificationSettings {
    taskListReminder: boolean;
    adminPost: boolean;
    groupPost: boolean;
    monthlySwot: boolean;
}

export interface Notification {
    PK: string; // userEmail
    SK: string; // NOTIFICATION
    userEmail: string;
    type: NotificationSettings;
    createdAt: string;
    updatedAt: string;
}

export class NotificationModel {
    static async create(notificationData: Partial<Notification>): Promise<Notification> {
        const now = new Date().toISOString();

        const notification: Notification = {
            PK: notificationData.userEmail!,
            SK: 'NOTIFICATION',
            userEmail: notificationData.userEmail!,
            type: notificationData.type || {
                taskListReminder: true,
                adminPost: true,
                groupPost: true,
                monthlySwot: true,
            },
            createdAt: now,
            updatedAt: now,
        };

        await dynamodb.put({
            TableName: 'notifications',
            Item: notification,
        }).promise();

        return notification;
    }

    static async findByEmail(userEmail: string): Promise<Notification | null> {
        const result = await dynamodb.get({
            TableName: 'notifications',
            Key: { PK: userEmail, SK: 'NOTIFICATION' },
        }).promise();

        return result.Item as Notification || null;
    }

    static async updateSettings(userEmail: string, settings: Partial<NotificationSettings>): Promise<Notification | null> {
        const updateExpressions: string[] = [];
        const expressionAttributeNames: { [key: string]: string } = {};
        const expressionAttributeValues: { [key: string]: any } = {};

        // Add updatedAt
        const now = new Date().toISOString();
        updateExpressions.push('updatedAt = :updatedAt');
        expressionAttributeValues[':updatedAt'] = now;

        // Update notification settings
        Object.keys(settings).forEach((key, index) => {
            if (settings[key as keyof NotificationSettings] !== undefined) {
                updateExpressions.push(`#type.#${key} = :val${index}`);
                expressionAttributeNames[`#type`] = 'type';
                expressionAttributeNames[`#${key}`] = key;
                expressionAttributeValues[`:val${index}`] = settings[key as keyof NotificationSettings];
            }
        });

        if (updateExpressions.length === 1) { // Only updatedAt
            return null;
        }

        const result = await dynamodb.update({
            TableName: 'notifications',
            Key: { PK: userEmail, SK: 'NOTIFICATION' },
            UpdateExpression: `SET ${updateExpressions.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW',
        }).promise();

        return result.Attributes as Notification;
    }

    static async findAll(limit: number = 100): Promise<Notification[]> {
        const result = await dynamodb.scan({
            TableName: 'notifications',
            FilterExpression: 'SK = :sk',
            ExpressionAttributeValues: {
                ':sk': 'NOTIFICATION',
            },
            Limit: limit,
        }).promise();

        return result.Items as Notification[] || [];
    }

    static async delete(userEmail: string): Promise<void> {
        await dynamodb.delete({
            TableName: 'notifications',
            Key: { PK: userEmail, SK: 'NOTIFICATION' },
        }).promise();
    }
}

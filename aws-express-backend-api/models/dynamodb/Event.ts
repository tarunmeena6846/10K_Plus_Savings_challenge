import { dynamodb } from '../../config/dynamodb';

export interface Event {
    PK: string; // eventId
    SK: string; // EVENT
    GSI1PK: string; // start date
    title: string;
    start: string;
    end: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export class EventModel {
    static async create(eventData: Partial<Event>): Promise<Event> {
        const eventId = `EVENT#${Date.now()}`;
        const now = new Date().toISOString();

        const event: Event = {
            PK: eventId,
            SK: 'EVENT',
            GSI1PK: eventData.start!,
            title: eventData.title!,
            start: eventData.start!,
            end: eventData.end!,
            description: eventData.description || '',
            createdAt: now,
            updatedAt: now,
        };

        await dynamodb.put({
            TableName: 'events',
            Item: event,
        }).promise();

        return event;
    }

    static async findById(eventId: string): Promise<Event | null> {
        const result = await dynamodb.get({
            TableName: 'events',
            Key: { PK: eventId, SK: 'EVENT' },
        }).promise();

        return result.Item as Event || null;
    }

    static async findByDateRange(startDate: string, endDate: string): Promise<Event[]> {
        const result = await dynamodb.query({
            TableName: 'events',
            IndexName: 'DateIndex',
            KeyConditionExpression: 'GSI1PK BETWEEN :startDate AND :endDate',
            ExpressionAttributeValues: {
                ':startDate': startDate,
                ':endDate': endDate,
            },
            ScanIndexForward: true,
        }).promise();

        return result.Items as Event[] || [];
    }

    static async findAll(limit: number = 100): Promise<Event[]> {
        const result = await dynamodb.scan({
            TableName: 'events',
            FilterExpression: 'SK = :sk',
            ExpressionAttributeValues: {
                ':sk': 'EVENT',
            },
            Limit: limit,
        }).promise();

        return result.Items as Event[] || [];
    }

    static async update(eventId: string, updateData: Partial<Event>): Promise<Event | null> {
        const updateExpressions: string[] = [];
        const expressionAttributeNames: { [key: string]: string } = {};
        const expressionAttributeValues: { [key: string]: any } = {};

        // Add updatedAt
        updateData.updatedAt = new Date().toISOString();

        // Update GSI key if start date changes
        if (updateData.start) {
            updateExpressions.push('GSI1PK = :start');
            expressionAttributeValues[':start'] = updateData.start;
        }

        Object.keys(updateData).forEach((key, index) => {
            if (key !== 'PK' && key !== 'SK' && key !== 'GSI1PK' &&
                updateData[key as keyof Event] !== undefined) {
                updateExpressions.push(`#${key} = :val${index}`);
                expressionAttributeNames[`#${key}`] = key;
                expressionAttributeValues[`:val${index}`] = updateData[key as keyof Event];
            }
        });

        if (updateExpressions.length === 0) {
            return null;
        }

        const result = await dynamodb.update({
            TableName: 'events',
            Key: { PK: eventId, SK: 'EVENT' },
            UpdateExpression: `SET ${updateExpressions.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW',
        }).promise();

        return result.Attributes as Event;
    }

    static async delete(eventId: string): Promise<void> {
        await dynamodb.delete({
            TableName: 'events',
            Key: { PK: eventId, SK: 'EVENT' },
        }).promise();
    }
}

import { dynamodb } from '../../config/dynamodb';

export interface Item {
    itemId: string;
    category: string;
    title: string;
    amount: number;
    type: string;
    date: string;
    createdAt: string;
    updatedAt: string;
}

export interface MonthlyData {
    month: string;
    actual: {
        income: number;
        expense: number;
        items: Item[];
    };
    current: {
        income: number;
        expense: number;
        items: Item[];
    };
    target: {
        income: number;
        expense: number;
        items: Item[];
    };
}

export interface YearlyData {
    year: number;
    monthlyData: MonthlyData[];
    totalActualIncome: number;
    totalActualExpenses: number;
    totalCurrentIncome: number;
    totalCurrentExpenses: number;
    totalTargetIncome: number;
    totalTargetExpenses: number;
}

export interface MonthlyDataRecord {
    PK: string; // userId
    SK: string; // year#month (e.g., "2024#01")
    userId: string;
    year: number;
    month: string;
    monthlyData: MonthlyData;
    createdAt: string;
    updatedAt: string;
}

export class MonthlyDataModel {
    static async create(monthlyData: Partial<MonthlyDataRecord>): Promise<MonthlyDataRecord> {
        const now = new Date().toISOString();

        const record: MonthlyDataRecord = {
            PK: monthlyData.userId!,
            SK: `${monthlyData.year}#${monthlyData.month}`,
            userId: monthlyData.userId!,
            year: monthlyData.year!,
            month: monthlyData.month!,
            monthlyData: monthlyData.monthlyData!,
            createdAt: now,
            updatedAt: now,
        };

        await dynamodb.put({
            TableName: 'monthly_data',
            Item: record,
        }).promise();

        return record;
    }

    static async findByUserIdAndMonth(userId: string, year: number, month: string): Promise<MonthlyDataRecord | null> {
        const result = await dynamodb.get({
            TableName: 'monthly_data',
            Key: {
                PK: userId,
                SK: `${year}#${month}`
            },
        }).promise();

        return result.Item as MonthlyDataRecord || null;
    }

    static async findByUserId(userId: string, limit: number = 50): Promise<MonthlyDataRecord[]> {
        const result = await dynamodb.query({
            TableName: 'monthly_data',
            KeyConditionExpression: 'PK = :userId',
            ExpressionAttributeValues: {
                ':userId': userId,
            },
            ScanIndexForward: false, // Sort by SK descending (newest first)
            Limit: limit,
        }).promise();

        return result.Items as MonthlyDataRecord[] || [];
    }

    static async findByYear(userId: string, year: number): Promise<MonthlyDataRecord[]> {
        const result = await dynamodb.query({
            TableName: 'monthly_data',
            KeyConditionExpression: 'PK = :userId AND begins_with(SK, :year)',
            ExpressionAttributeValues: {
                ':userId': userId,
                ':year': `${year}#`,
            },
            ScanIndexForward: true, // Sort by month ascending
        }).promise();

        return result.Items as MonthlyDataRecord[] || [];
    }

    static async update(userId: string, year: number, month: string, updateData: Partial<MonthlyDataRecord>): Promise<MonthlyDataRecord | null> {
        const updateExpressions: string[] = [];
        const expressionAttributeNames: { [key: string]: string } = {};
        const expressionAttributeValues: { [key: string]: any } = {};

        // Add updatedAt
        updateData.updatedAt = new Date().toISOString();

        Object.keys(updateData).forEach((key, index) => {
            if (key !== 'PK' && key !== 'SK' && key !== 'userId' && key !== 'year' && key !== 'month' &&
                updateData[key as keyof MonthlyDataRecord] !== undefined) {
                updateExpressions.push(`#${key} = :val${index}`);
                expressionAttributeNames[`#${key}`] = key;
                expressionAttributeValues[`:val${index}`] = updateData[key as keyof MonthlyDataRecord];
            }
        });

        if (updateExpressions.length === 0) {
            return null;
        }

        const result = await dynamodb.update({
            TableName: 'monthly_data',
            Key: {
                PK: userId,
                SK: `${year}#${month}`
            },
            UpdateExpression: `SET ${updateExpressions.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW',
        }).promise();

        return result.Attributes as MonthlyDataRecord;
    }

    static async addItem(userId: string, year: number, month: string, item: Omit<Item, 'itemId' | 'createdAt' | 'updatedAt'>, type: 'actual' | 'current' | 'target'): Promise<MonthlyDataRecord | null> {
        const record = await this.findByUserIdAndMonth(userId, year, month);
        if (!record) return null;

        const now = new Date().toISOString();
        const newItem: Item = {
            itemId: `ITEM#${Date.now()}`,
            ...item,
            createdAt: now,
            updatedAt: now,
        };

        const updatedMonthlyData = { ...record.monthlyData };
        updatedMonthlyData[type].items.push(newItem);

        // Recalculate totals
        updatedMonthlyData[type].income = updatedMonthlyData[type].items
            .filter(i => i.type === 'income')
            .reduce((sum, i) => sum + i.amount, 0);

        updatedMonthlyData[type].expense = updatedMonthlyData[type].items
            .filter(i => i.type === 'expense')
            .reduce((sum, i) => sum + i.amount, 0);

        return await this.update(userId, year, month, { monthlyData: updatedMonthlyData });
    }

    static async updateItem(userId: string, year: number, month: string, itemId: string, updateData: Partial<Item>, type: 'actual' | 'current' | 'target'): Promise<MonthlyDataRecord | null> {
        const record = await this.findByUserIdAndMonth(userId, year, month);
        if (!record) return null;

        const updatedMonthlyData = { ...record.monthlyData };
        const items = updatedMonthlyData[type].items.map(item =>
            item.itemId === itemId
                ? { ...item, ...updateData, updatedAt: new Date().toISOString() }
                : item
        );

        updatedMonthlyData[type].items = items;

        // Recalculate totals
        updatedMonthlyData[type].income = items
            .filter(i => i.type === 'income')
            .reduce((sum, i) => sum + i.amount, 0);

        updatedMonthlyData[type].expense = items
            .filter(i => i.type === 'expense')
            .reduce((sum, i) => sum + i.amount, 0);

        return await this.update(userId, year, month, { monthlyData: updatedMonthlyData });
    }

    static async deleteItem(userId: string, year: number, month: string, itemId: string, type: 'actual' | 'current' | 'target'): Promise<MonthlyDataRecord | null> {
        const record = await this.findByUserIdAndMonth(userId, year, month);
        if (!record) return null;

        const updatedMonthlyData = { ...record.monthlyData };
        updatedMonthlyData[type].items = updatedMonthlyData[type].items.filter(item => item.itemId !== itemId);

        // Recalculate totals
        updatedMonthlyData[type].income = updatedMonthlyData[type].items
            .filter(i => i.type === 'income')
            .reduce((sum, i) => sum + i.amount, 0);

        updatedMonthlyData[type].expense = updatedMonthlyData[type].items
            .filter(i => i.type === 'expense')
            .reduce((sum, i) => sum + i.amount, 0);

        return await this.update(userId, year, month, { monthlyData: updatedMonthlyData });
    }

    static async delete(userId: string, year: number, month: string): Promise<void> {
        await dynamodb.delete({
            TableName: 'monthly_data',
            Key: {
                PK: userId,
                SK: `${year}#${month}`
            },
        }).promise();
    }
}

import { dynamodb } from '../../config/dynamodb';

export interface Task {
    taskId: string;
    title: string;
    isComplete: boolean;
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SwotTask {
    PK: string; // userId
    SK: string; // SWOT_TASK
    userId: string;
    tasks: Task[];
    isReminderSet: boolean;
    createdAt: string;
    updatedAt: string;
}

export class SwotTaskModel {
    static async create(swotData: Partial<SwotTask>): Promise<SwotTask> {
        const now = new Date().toISOString();

        const swotTask: SwotTask = {
            PK: swotData.userId!,
            SK: 'SWOT_TASK',
            userId: swotData.userId!,
            tasks: swotData.tasks || [],
            isReminderSet: swotData.isReminderSet || false,
            createdAt: now,
            updatedAt: now,
        };

        await dynamodb.put({
            TableName: 'swot_tasks',
            Item: swotTask,
        }).promise();

        return swotTask;
    }

    static async findByUserId(userId: string): Promise<SwotTask | null> {
        const result = await dynamodb.get({
            TableName: 'swot_tasks',
            Key: { PK: userId, SK: 'SWOT_TASK' },
        }).promise();

        return result.Item as SwotTask || null;
    }

    static async updateTasks(userId: string, tasks: Task[]): Promise<SwotTask | null> {
        const result = await dynamodb.update({
            TableName: 'swot_tasks',
            Key: { PK: userId, SK: 'SWOT_TASK' },
            UpdateExpression: 'SET tasks = :tasks, updatedAt = :updatedAt',
            ExpressionAttributeValues: {
                ':tasks': tasks,
                ':updatedAt': new Date().toISOString(),
            },
            ReturnValues: 'ALL_NEW',
        }).promise();

        return result.Attributes as SwotTask;
    }

    static async addTask(userId: string, task: Omit<Task, 'taskId' | 'createdAt' | 'updatedAt'>): Promise<SwotTask | null> {
        const now = new Date().toISOString();
        const newTask: Task = {
            taskId: `TASK#${Date.now()}`,
            ...task,
            createdAt: now,
            updatedAt: now,
        };

        const result = await dynamodb.update({
            TableName: 'swot_tasks',
            Key: { PK: userId, SK: 'SWOT_TASK' },
            UpdateExpression: 'SET tasks = list_append(tasks, :task), updatedAt = :updatedAt',
            ExpressionAttributeValues: {
                ':task': [newTask],
                ':updatedAt': now,
            },
            ReturnValues: 'ALL_NEW',
        }).promise();

        return result.Attributes as SwotTask;
    }

    static async updateTask(userId: string, taskId: string, updateData: Partial<Task>): Promise<SwotTask | null> {
        const swotTask = await this.findByUserId(userId);
        if (!swotTask) return null;

        const updatedTasks = swotTask.tasks.map(task =>
            task.taskId === taskId
                ? { ...task, ...updateData, updatedAt: new Date().toISOString() }
                : task
        );

        return await this.updateTasks(userId, updatedTasks);
    }

    static async deleteTask(userId: string, taskId: string): Promise<SwotTask | null> {
        const swotTask = await this.findByUserId(userId);
        if (!swotTask) return null;

        const updatedTasks = swotTask.tasks.filter(task => task.taskId !== taskId);
        return await this.updateTasks(userId, updatedTasks);
    }

    static async updateReminderStatus(userId: string, isReminderSet: boolean): Promise<SwotTask | null> {
        const result = await dynamodb.update({
            TableName: 'swot_tasks',
            Key: { PK: userId, SK: 'SWOT_TASK' },
            UpdateExpression: 'SET isReminderSet = :isReminderSet, updatedAt = :updatedAt',
            ExpressionAttributeValues: {
                ':isReminderSet': isReminderSet,
                ':updatedAt': new Date().toISOString(),
            },
            ReturnValues: 'ALL_NEW',
        }).promise();

        return result.Attributes as SwotTask;
    }

    static async findAll(limit: number = 100): Promise<SwotTask[]> {
        const result = await dynamodb.scan({
            TableName: 'swot_tasks',
            FilterExpression: 'SK = :sk',
            ExpressionAttributeValues: {
                ':sk': 'SWOT_TASK',
            },
            Limit: limit,
        }).promise();

        return result.Items as SwotTask[] || [];
    }

    static async delete(userId: string): Promise<void> {
        await dynamodb.delete({
            TableName: 'swot_tasks',
            Key: { PK: userId, SK: 'SWOT_TASK' },
        }).promise();
    }
}

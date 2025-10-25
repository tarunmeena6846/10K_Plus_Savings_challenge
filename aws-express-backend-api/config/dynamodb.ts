import AWS from 'aws-sdk';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

// Production AWS configuration
// console.log('🔧 Configuring for AWS DynamoDB');
// console.log('AWS_REGION:', process.env.AWS_REGION);
// console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
// console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY);

AWS.config.update({
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const dynamodb = new AWS.DynamoDB.DocumentClient();

// Table configurations
export const TABLE_CONFIGS = {
    USERS: {
        TableName: 'users',
        KeySchema: [
            { AttributeName: 'PK', KeyType: 'HASH' }, // userId
        ],
        AttributeDefinitions: [
            { AttributeName: 'PK', AttributeType: 'S' },
            { AttributeName: 'GSI1PK', AttributeType: 'S' }, // email
            { AttributeName: 'GSI2PK', AttributeType: 'S' }, // username
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: 'EmailIndex',
                KeySchema: [
                    { AttributeName: 'GSI1PK', KeyType: 'HASH' },
                ],
                Projection: { ProjectionType: 'ALL' },
            },
            {
                IndexName: 'UsernameIndex',
                KeySchema: [
                    { AttributeName: 'GSI2PK', KeyType: 'HASH' },
                ],
                Projection: { ProjectionType: 'ALL' },
            },
        ],
        BillingMode: 'PAY_PER_REQUEST',
    },
    POSTS: {
        TableName: 'posts',
        KeySchema: [
            { AttributeName: 'PK', KeyType: 'HASH' }, // postId
        ],
        AttributeDefinitions: [
            { AttributeName: 'PK', AttributeType: 'S' },
            { AttributeName: 'GSI1PK', AttributeType: 'S' }, // author
            { AttributeName: 'GSI1SK', AttributeType: 'S' }, // createdAt
            { AttributeName: 'GSI2PK', AttributeType: 'S' }, // status
            { AttributeName: 'GSI3PK', AttributeType: 'S' }, // tag
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: 'AuthorTimeIndex',
                KeySchema: [
                    { AttributeName: 'GSI1PK', KeyType: 'HASH' },
                    { AttributeName: 'GSI1SK', KeyType: 'RANGE' },
                ],
                Projection: { ProjectionType: 'ALL' },
            },
            {
                IndexName: 'StatusIndex',
                KeySchema: [
                    { AttributeName: 'GSI2PK', KeyType: 'HASH' },
                    { AttributeName: 'GSI1SK', KeyType: 'RANGE' },
                ],
                Projection: { ProjectionType: 'ALL' },
            },
            {
                IndexName: 'TagIndex',
                KeySchema: [
                    { AttributeName: 'GSI3PK', KeyType: 'HASH' },
                    { AttributeName: 'GSI1SK', KeyType: 'RANGE' },
                ],
                Projection: { ProjectionType: 'ALL' },
            },
        ],
        BillingMode: 'PAY_PER_REQUEST',
    },
    COMMENTS: {
        TableName: 'comments',
        KeySchema: [
            { AttributeName: 'PK', KeyType: 'HASH' }, // commentId
        ],
        AttributeDefinitions: [
            { AttributeName: 'PK', AttributeType: 'S' },
            { AttributeName: 'GSI1PK', AttributeType: 'S' }, // postId
            { AttributeName: 'GSI1SK', AttributeType: 'S' }, // createdAt
            { AttributeName: 'GSI2PK', AttributeType: 'S' }, // author
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: 'PostTimeIndex',
                KeySchema: [
                    { AttributeName: 'GSI1PK', KeyType: 'HASH' },
                    { AttributeName: 'GSI1SK', KeyType: 'RANGE' },
                ],
                Projection: { ProjectionType: 'ALL' },
            },
            {
                IndexName: 'AuthorIndex',
                KeySchema: [
                    { AttributeName: 'GSI2PK', KeyType: 'HASH' },
                    { AttributeName: 'GSI1SK', KeyType: 'RANGE' },
                ],
                Projection: { ProjectionType: 'ALL' },
            },
        ],
        BillingMode: 'PAY_PER_REQUEST',
    },
    EVENTS: {
        TableName: 'events',
        KeySchema: [
            { AttributeName: 'PK', KeyType: 'HASH' }, // eventId
        ],
        AttributeDefinitions: [
            { AttributeName: 'PK', AttributeType: 'S' },
            { AttributeName: 'GSI1PK', AttributeType: 'S' }, // start date
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: 'DateIndex',
                KeySchema: [
                    { AttributeName: 'GSI1PK', KeyType: 'HASH' },
                ],
                Projection: { ProjectionType: 'ALL' },
            },
        ],
        BillingMode: 'PAY_PER_REQUEST',
    },
    SWOT_TASKS: {
        TableName: 'swot_tasks',
        KeySchema: [
            { AttributeName: 'PK', KeyType: 'HASH' }, // userId
        ],
        AttributeDefinitions: [
            { AttributeName: 'PK', AttributeType: 'S' },
        ],
        BillingMode: 'PAY_PER_REQUEST',
    },
    MONTHLY_DATA: {
        TableName: 'monthly_data',
        KeySchema: [
            { AttributeName: 'PK', KeyType: 'HASH' }, // userId
            { AttributeName: 'SK', KeyType: 'RANGE' }, // year#month
        ],
        AttributeDefinitions: [
            { AttributeName: 'PK', AttributeType: 'S' },
            { AttributeName: 'SK', AttributeType: 'S' },
        ],
        BillingMode: 'PAY_PER_REQUEST',
    },
    NOTIFICATIONS: {
        TableName: 'notifications',
        KeySchema: [
            { AttributeName: 'PK', KeyType: 'HASH' }, // userEmail
        ],
        AttributeDefinitions: [
            { AttributeName: 'PK', AttributeType: 'S' },
        ],
        BillingMode: 'PAY_PER_REQUEST',
    },
    TAGS: {
        TableName: 'tags',
        KeySchema: [
            { AttributeName: 'PK', KeyType: 'HASH' }, // tag
        ],
        AttributeDefinitions: [
            { AttributeName: 'PK', AttributeType: 'S' },
        ],
        BillingMode: 'PAY_PER_REQUEST',
    },
};

// Helper function to create tables
export const createTables = async () => {
    const dynamodbClient = new AWS.DynamoDB();

    for (const [tableName, config] of Object.entries(TABLE_CONFIGS)) {
        try {
            await dynamodbClient.createTable(config).promise();
            console.log(`Table ${config.TableName} created successfully`);
        } catch (error: any) {
            if (error.code === 'ResourceInUseException') {
                console.log(`Table ${config.TableName} already exists`);
            } else {
                console.error(`Error creating table ${config.TableName}:`, error);
            }
        }
    }
};

import { createTables } from '../config/dynamodb';
import { UserModel } from '../models/dynamodb/User';

async function setupDynamoDB() {
    console.log('🚀 Setting up DynamoDB for local development...');

    try {
        // Set environment for local development
        process.env.NODE_ENV = 'development';
        process.env.LOCAL_DYNAMODB = 'true';

        console.log('📊 Creating tables...');
        await createTables();
        console.log('✅ Tables created successfully!');

        console.log('🌱 Creating test users...');

        // Create admin user
        const adminUser = await UserModel.create({
            username: 'admin',
            email: 'admin@wealthx.com',
            password: '$2b$10$example', // This would be hashed in real app
            isAdmin: true,
            verified: true,
            verificationToken: 'admin-token',
        });
        console.log('✅ Admin user created:', adminUser.PK);

        // Create test user
        const testUser = await UserModel.create({
            username: 'testuser',
            email: 'test@example.com',
            password: '$2b$10$example',
            isAdmin: false,
            verified: true,
            verificationToken: 'user-token',
        });
        console.log('✅ Test user created:', testUser.PK);

        console.log('🎉 DynamoDB setup complete!');
        console.log('📍 DynamoDB Local: http://localhost:8000');
        console.log('🚀 Start your app with: npm run dev');

    } catch (error) {
        console.error('❌ Setup failed:', error);
        process.exit(1);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    setupDynamoDB();
}

export { setupDynamoDB };

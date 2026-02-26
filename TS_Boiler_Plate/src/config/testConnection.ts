import db from "./database.js";


async function testConnection(): Promise<void> {
    try {
        await db.raw('SELECT 1');
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
    } finally {
        await db.destroy();
    }
}

testConnection();

export default testConnection;
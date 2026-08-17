import { PrismaClient } from '@prisma/client';

async function testPostgresDb() {
    const url = `postgresql://postgres:postgres@localhost:5432/postgres?schema=public`;
    console.log(`Testing connection to default 'postgres' db...`);
    const client = new PrismaClient({
        datasources: { db: { url } }
    });
    try {
        await client.$connect();
        console.log(`✅ SUCCESS! Connected to 'postgres' database with postgres:postgres`);
        await client.$disconnect();
    } catch (e) {
        console.log(`❌ Failed: ${e.message}`);
        await client.$disconnect();
    }
}

testPostgresDb();

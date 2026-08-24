import { PrismaClient } from '@prisma/client';

const dbUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/megareview?schema=public";

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient({
    datasources: {
        db: {
            url: dbUrl,
        },
    },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;

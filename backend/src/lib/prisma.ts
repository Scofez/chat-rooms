import dotenv from 'dotenv';
import pg from 'pg';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

//loading env variables
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is missing from environment variables');
}

const pool = new pg.Pool({ connectionString });

// Create the Prisma adapter from the pg pool
const adapter = new PrismaPg(pool);

// Construct PrismaClient WITH the adapter option
const prisma = new PrismaClient({ adapter });

// Graceful shutdown to close adapter / pool
const shutdown = async () => {
  try {
    await prisma.$disconnect();
  } finally {
    await pool.end().catch(() => {});
    process.exit(0);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default prisma;
import app from './app';
import config from './config/config';
import { prisma } from './lib/prisma';

async function startServer() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connected.');

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch {
    console.error(
      'Database connection failed. Check DATABASE_URL and confirm the Neon database is reachable.',
    );
    process.exitCode = 1;
  }
}

void startServer();
import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
}

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret || Buffer.byteLength(jwtSecret) < 32) {
  throw new Error(
    'JWT_SECRET must be set to a random value of at least 32 bytes.',
  );
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret,
};

export default config;

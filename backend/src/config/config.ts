import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  JWT_SECRET: string;
}
// read from .env file and set the environment variables
const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret-nur-fuer-lokal",
};

export default config;

import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;
const DB_STRING = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}`;

export const sequelize = new Sequelize(DB_STRING, {
  logging: false,
  native: false,
});

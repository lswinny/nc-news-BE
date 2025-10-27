const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";

if(ENV !== "production") {
require("dotenv").config({ path: `${__dirname}/../.env.${ENV}` });
}

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("No PGDATABASE or DATABASE_URL configured");
}

const config = {};
if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

const db = new Pool(config);

module.exports = db;

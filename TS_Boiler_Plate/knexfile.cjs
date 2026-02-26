/* eslint-disable */
require('dotenv').config();

/** @type {import('knex').Knex.Config} */
const config = {
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    pool: { min: 2, max: 10 },
    migrations: {
        directory: './src/database/migrations',
        extension: 'ts',
    },
    seeds: {
        directory: './src/database/seeds',
        extension: 'ts',
    },
};

module.exports = config;

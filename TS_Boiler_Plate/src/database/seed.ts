import config from '../config/index.js';
import knex from 'knex';

const runner = knex({
    client: 'mysql2',
    connection: {
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.name,
    },
    seeds: {
        directory: './src/database/seeds',
        extension: 'ts',
    },
});

await runner.seed.run();
console.log('✅ All seeds ran successfully');

await runner.destroy();
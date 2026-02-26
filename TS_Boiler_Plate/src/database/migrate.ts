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
    migrations: {
        directory: './src/database/migrations',
        extension: 'ts',
    },
});

const [batch, migrations] = await runner.migrate.latest();
console.log(`✅ Ran ${migrations.length} migrations in batch ${batch}`);
migrations.forEach((m: string) => console.log(' -', m));

await runner.destroy();
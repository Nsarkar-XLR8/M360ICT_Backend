import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('employees', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.integer('age').notNullable();
        table.string('designation').notNullable();
        table.date('hiring_date').notNullable();
        table.date('date_of_birth').notNullable();
        table.decimal('salary', 10, 2).notNullable();
        table.string('photo_path').nullable();
        table.timestamp('deleted_at').nullable(); // soft delete
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('employees');
}
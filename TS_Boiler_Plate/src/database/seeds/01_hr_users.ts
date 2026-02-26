import type { Knex } from 'knex';
import bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
    await knex('hr_users').del();

    const passwordHash = await bcrypt.hash('admin123', 10);

    await knex('hr_users').insert([
        {
            name: 'Admin HR',
            email: 'admin@hr.com',
            password_hash: passwordHash,
        },
    ]);

    console.log('✅ hr_users seeded successfully');
}
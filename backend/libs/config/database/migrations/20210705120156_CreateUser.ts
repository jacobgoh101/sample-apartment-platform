import { Knex } from 'knex';

const tableName = 'users';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, (t) => {
    // this creates an "id" column that gets autoincremented
    t.increments();
    t.timestamps();

    t.string('email', 10000).unique();
    t.text('passwordHash').nullable();
    t.text('name');
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}

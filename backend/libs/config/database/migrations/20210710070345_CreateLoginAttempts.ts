import { Knex } from 'knex';

const usersTableName = 'users';
const tableName = 'failed_login_attempts';

export async function up(knex: Knex) {
  return knex.schema
    .alterTable(usersTableName, (t) => {
      t.boolean('blocked').defaultTo(false);
    })
    .createTable(tableName, (t) => {
      // this creates an "id" column that gets autoincremented
      t.increments();
      t.timestamps();

      t.string('ip_address', 255);

      t.integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable(usersTableName)
        .onDelete('CASCADE');
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName).alterTable(usersTableName, (t) => {
    t.dropColumn('blocked');
  });
}

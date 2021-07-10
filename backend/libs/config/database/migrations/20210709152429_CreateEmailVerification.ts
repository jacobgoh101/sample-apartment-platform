import { Knex } from 'knex';

const usersTableName = 'users';
const tableName = 'email_verifications';

export async function up(knex: Knex) {
  return knex.schema
    .alterTable(usersTableName, (t) => {
      t.boolean('email_verified').notNullable();
    })
    .createTable(tableName, (t) => {
      // this creates an "id" column that gets autoincremented
      t.increments();
      t.timestamps();

      t.integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable(usersTableName)
        .onDelete('CASCADE');

      t.dateTime('expired_at')
        .defaultTo(knex.raw(`NOW() + INTERVAL '7 day'`))
        .index();
      t.dateTime('verified_at').nullable();
      t.string('token', 64).index();
      t.string('email', 1000).index();
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName).alterTable(usersTableName, (t) => {
    t.dropColumn('email_verified');
  });
}

import { Knex } from 'knex';

const tableName = 'users';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(tableName, (t) => {
      // this creates an "id" column that gets autoincremented
      t.increments();
      t.timestamps();

      t.string('email', 10000);
      t.text('passwordHash').nullable();
      t.text('name');
      t.string('google_account_id', 255).unique().nullable();
      t.string('facebook_account_id', 255).unique().nullable();

      t.unique(['email', 'google_account_id', 'facebook_account_id']);
    })
    .raw(
      `CREATE UNIQUE INDEX "unique_partial_users_email" ON "users" ("email") WHERE "google_account_id" IS  NULL and "facebook_account_id" IS  NULL`,
    );
}

export async function down(knex: Knex) {
  return knex.schema
    .raw('DROP INDEX IF EXISTS "unique_partial_users_email" ')
    .dropTable(tableName);
}

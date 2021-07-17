import { APARTMENT_STATUS } from '../../../apartment/src/apartment.constant';
import { Knex } from 'knex';

const usersTableName = 'users';
const tableName = 'apartments';

export async function up(knex: Knex) {
  return knex.schema
    .raw(`CREATE EXTENSION postgis;`)
    .createTable(tableName, (t) => {
      // this creates an "id" column that gets autoincremented
      t.increments();
      t.timestamps();

      t.string('name', 100000);
      t.text('description');
      t.integer('floor_area_square_meter').unsigned().index();
      t.bigInteger('price_per_month_in_cents').unsigned().index();
      t.integer('num_of_rooms').unsigned().index();
      t.string('status', 255)
        .defaultTo(APARTMENT_STATUS.AVAILABLE)
        .notNullable()
        .index();
      t.specificType('coordinates', 'geometry(point, 4326)').index();

      t.integer('realtor_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable(usersTableName);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName).raw(`DROP EXTENSION postgis;`);
}

import { st } from '../../../../apps/web/src/database/database.module';
import { UserModel } from '../../../account/src/user/user.model';
import { ApartmentModel } from '../../../apartment/src/apartment.model';
import * as faker from 'faker';
import { Knex } from 'knex';
import { sample, random } from 'lodash';

export async function seed(knex: Knex): Promise<any> {
  const userModel = () => knex<UserModel>(UserModel.tableName);
  const apartmentModel = () => knex<ApartmentModel>(ApartmentModel.tableName);

  const seededRealtors = await userModel().where(
    'name',
    'like',
    '%Seeded Realtor%',
  );

  for (let i = 0; i < 50; i++) {
    await apartmentModel().insert({
      name: faker.address.streetName(),
      description:
        faker.address.secondaryAddress() + ', ' + faker.lorem.sentence(),
      pricePerMonthInCents: +(random(100, 1000, true) * 100).toFixed(0),
      coordinates: st.setSRID(
        st.makePoint(
          +faker.address.longitude(-169.9146, -129.993),
          +faker.address.latitude(52.5964, 71.5232),
        ),
        4326,
      ),
      realtorId: sample(seededRealtors)?.id,
      numOfRooms: random(1, 10, false),
      floorAreaSquareMeter: random(100, 500, false),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

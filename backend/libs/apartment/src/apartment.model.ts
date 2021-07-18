import { UserModel } from '../../account/src/user/user.model';
import { BaseModel } from '../../config/database/models/base.model';
import { APARTMENT_STATUS } from './apartment.constant';
import { Model } from 'objection';

export class ApartmentModel extends BaseModel {
  static tableName = 'apartments';

  name: string;
  description: string;
  floorAreaSquareMeter: number;
  pricePerMonthInCents: number;
  numOfRooms: number;
  longitude: number;
  latitude: number;
  coordinates: unknown;
  realtorId: number;
  status: APARTMENT_STATUS;
  realtor?: UserModel;

  get pricePerMonth() {
    return +(Number(this.pricePerMonthInCents) / 100).toFixed(2);
  }

  $formatJson(json) {
    json = super.$formatJson(json);
    json.createdAt = new Date(json.createdAt);
    json.updatedAt = new Date(json.updatedAt);
    json.pricePerMonth = +(Number(json.pricePerMonthInCents) / 100).toFixed(2);
    return json;
  }

  static relationMappings = {
    realtor: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'users.id',
        to: 'apartments.realtorId',
      },
    },
  };

  static modifiers = {
    defaultSelects(query) {
      const { ref, raw } = ApartmentModel;
      query.select(
        ref('id'),
        ref('createdAt'),
        ref('updatedAt'),
        ref('name'),
        ref('description'),
        ref('floorAreaSquareMeter'),
        ref('pricePerMonthInCents'),
        ref('numOfRooms'),
        raw('ST_X(coordinates) as longitude'),
        raw('ST_Y(coordinates) as latitude'),
        ref('realtorId'),
        ref('status'),
      );
    },
  };
}

import { st } from '../../../apps/web/src/database/database.module';
import { UserModel } from '../../account/src/user/user.model';
import { RESOURCE, RESOURCE_ACTION, ROLES } from '../../rbac/src/rbac.constant';
import { RbacService } from '../../rbac/src/rbac.service';
import { Pagination } from '../../types/pagination.types';
import { APARTMENT_STATUS } from './apartment.constant';
import {
  CreateApartmentDto,
  FindApartmentQueryDto,
  UpdateApartmentDto,
} from './apartment.dto';
import { ApartmentModel } from './apartment.model';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { omit } from 'lodash';
import { ModelClass } from 'objection';

@Injectable()
export class ApartmentService {
  constructor(
    @Inject('ApartmentModel')
    private readonly apartmentModel: ModelClass<ApartmentModel>,
    @Inject('UserModel')
    private readonly userModel: ModelClass<UserModel>,
    private readonly rbacService: RbacService,
  ) {}

  async create(body: CreateApartmentDto) {
    const { pricePerMonth, longitude, latitude } = body;
    const pricePerMonthInCents = +(pricePerMonth * 100).toFixed(0);
    const apartment = await this.apartmentModel
      .query()
      .insert({
        ...omit(body, 'latitude', 'longitude', 'pricePerMonth'),
        pricePerMonthInCents,
        coordinates: st.setSRID(st.makePoint(longitude, latitude), 4326),
      })
      .returning('*');
    return await this.apartmentModel
      .query()
      .modify('defaultSelects')
      .findById(apartment.id);
  }

  async update(id: number, body: UpdateApartmentDto) {
    if (!(await this.apartmentModel.query().findById(id)))
      throw new BadRequestException();

    const { pricePerMonth, longitude, latitude } = body;
    const pricePerMonthInCents = +(pricePerMonth * 100).toFixed(0);
    await this.apartmentModel
      .query()
      .where({ id })
      .update({
        ...omit(body, 'latitude', 'longitude', 'pricePerMonth'),
        pricePerMonthInCents,
        coordinates: st.setSRID(st.makePoint(longitude, latitude), 4326),
      });
    return await this.apartmentModel
      .query()
      .modify('defaultSelects')
      .findById(id);
  }

  async find(
    conditions: FindApartmentQueryDto,
    user: UserModel,
  ): Promise<Pagination<ApartmentModel>> {
    const {
      page = 1,
      limit = 10,
      minFloorAreaSquareMeter,
      maxFloorAreaSquareMeter,
      minPricePerMonth,
      maxPricePerMonth,
      minNumOfRooms,
      maxNumOfRooms,
      sortedBy,
      longitude,
      latitude,
      status,
    } = conditions || {};

    await this.validateUserRoleForFindApartments(status, user);

    const query = this.apartmentModel
      .query()
      .withGraphFetched('realtor')
      .modify('defaultSelects')
      .page(+page - 1, +limit);

    /* START handle filters */
    if (minFloorAreaSquareMeter)
      query.where('floorAreaSquareMeter', '>=', minFloorAreaSquareMeter);
    if (maxFloorAreaSquareMeter)
      query.where('floorAreaSquareMeter', '<=', maxFloorAreaSquareMeter);
    if (minPricePerMonth)
      query.where('pricePerMonthInCents', '>=', minPricePerMonth * 100);
    if (maxPricePerMonth)
      query.where('pricePerMonthInCents', '<=', maxPricePerMonth * 100);
    if (minNumOfRooms) query.where('numOfRooms', '>=', minNumOfRooms);
    if (maxNumOfRooms) query.where('numOfRooms', '<=', maxNumOfRooms);
    if (status) query.where({ status });
    /* END handle filters */

    if (sortedBy === 'nearest')
      query.orderByRaw(
        `coordinates <-> 'SRID=4326;POINT(${longitude} ${latitude})'::geometry`,
      );
    else query.orderBy('id', 'DESC');

    const { results, total } = await query;
    return {
      items: results,
      meta: {
        currentPage: +page,
        itemsPerPage: +limit,
        totalItems: total,
        totalPages: Math.ceil(total / +limit),
        itemCount: results.length,
      },
    };
  }

  private async validateUserRoleForFindApartments(
    status: APARTMENT_STATUS,
    user: UserModel,
  ) {
    if (status !== APARTMENT_STATUS.RENTED) return;

    if (!user?.id)
      throw new BadRequestException('Not allowed to query rented apartments');

    const isValid = await this.rbacService.hasImplicitPermissionForUser(
      user?.id,
      RESOURCE.APARTMENTS,
      RESOURCE_ACTION.SEE_RENTED_APARTMENTS,
    );

    if (!isValid)
      throw new BadRequestException('Not allowed to query rented apartments');
  }

  async findById(id: number): Promise<ApartmentModel> {
    return this.apartmentModel.query().modify('defaultSelects').findById(id);
  }

  async delete(id: number) {
    if (!(await this.apartmentModel.query().findById(id)))
      throw new BadRequestException();

    return this.apartmentModel.query().deleteById(id);
  }

  async getAllRealtors() {
    return this.userModel
      .query()
      .joinEager('roles')
      .where('roles.v1', ROLES.REALTOR)
      .orderBy('id', 'DESC');
  }

  async findApartmentsByRealtor(realtorId: number): Promise<ApartmentModel[]> {
    return this.apartmentModel
      .query()
      .where({ realtorId })
      .modify('defaultSelects');
  }
}

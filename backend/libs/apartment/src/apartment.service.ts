import { st } from '../../../apps/web/src/database/database.module';
import { IPaginationOptions, Pagination } from '../../types/pagination.types';
import {
  CreateApartmentDto,
  FindApartmentQueryDto,
  UpdateApartmentDto,
} from './apartment.dto';
import { ApartmentModel } from './apartment.model';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { query } from 'express';
import { omit } from 'lodash';
import { ModelClass } from 'objection';

@Injectable()
export class ApartmentService {
  constructor(
    @Inject('ApartmentModel')
    private readonly apartmentModel: ModelClass<ApartmentModel>,
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
    } = conditions || {};
    const query = this.apartmentModel
      .query()
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

  async delete(id: number) {
    if (!(await this.apartmentModel.query().findById(id)))
      throw new BadRequestException();

    return this.apartmentModel.query().deleteById(id);
  }
}

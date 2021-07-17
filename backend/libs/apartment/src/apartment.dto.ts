import { APARTMENT_STATUS } from './apartment.constant';
import { Type } from 'class-transformer';
import {
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  Min,
  IsInt,
  IsOptional,
  IsIn,
  ValidateIf,
  Max,
} from 'class-validator';

export class CreateApartmentDto {
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100000)
  description: string;

  @IsInt()
  @Min(1)
  floorAreaSquareMeter: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  pricePerMonth: number;

  @IsInt()
  @Min(1)
  numOfRooms: number;

  @Min(-180.999999)
  @Max(180.999999)
  longitude: number;

  @Min(-180.999999)
  @Max(180.999999)
  latitude: number;

  @IsInt()
  @Min(1)
  realtorId: number;
}

export class UpdateApartmentDto {
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100000)
  description: string;

  @IsInt()
  @Min(1)
  floorAreaSquareMeter: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  pricePerMonth: number;

  @IsInt()
  @Min(1)
  numOfRooms: number;

  @Min(-180.999999)
  @Max(180.999999)
  longitude: number;

  @Min(-180.999999)
  @Max(180.999999)
  latitude: number;

  @IsInt()
  @Min(1)
  realtorId: number;
}

export class FindApartmentQueryDto {
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  minFloorAreaSquareMeter: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  maxFloorAreaSquareMeter: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  minPricePerMonth: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxPricePerMonth: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  minNumOfRooms: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  maxNumOfRooms: number;

  @IsString()
  @IsIn(Object.values(APARTMENT_STATUS))
  @IsOptional()
  status: APARTMENT_STATUS;

  @IsString()
  @IsIn(['nearest'])
  @IsOptional()
  sortedBy: 'nearest';

  @ValidateIf((o) => o.sortedBy === 'nearest')
  @Min(-180.999999)
  @Max(180.999999)
  @Type(() => Number)
  longitude: number;

  @ValidateIf((o) => o.sortedBy === 'nearest')
  @Min(-180.999999)
  @Max(180.999999)
  @Type(() => Number)
  latitude: number;

  //paginations
  @Type(() => Number)
  page: number;
  @Type(() => Number)
  limit: number;
}

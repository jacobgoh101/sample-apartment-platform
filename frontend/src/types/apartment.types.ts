export enum APARTMENT_STATUS {
  AVAILABLE = 'AVAILABLE',
  RENTED = 'RENTED',
}

export interface Apartment {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  floorAreaSquareMeter: number;
  numOfRooms: number;
  longitude: number;
  latitude: number;
  realtorId: number;
  pricePerMonth: number;
  status: APARTMENT_STATUS;
}

export interface UpdateApartmentDto {
  name: string;
  description: string;
  floorAreaSquareMeter: number;
  pricePerMonth: number;
  numOfRooms: number;
  longitude: number;
  latitude: number;
  realtorId: number;
  status: APARTMENT_STATUS;
}

export interface CreateApartmentDto {
  name: string;
  description: string;
  floorAreaSquareMeter: number;
  pricePerMonth: number;
  numOfRooms: number;
  longitude: number;
  latitude: number;
  realtorId: number;
  status: APARTMENT_STATUS;
}

export interface FindApartmentQueryDto {
  minFloorAreaSquareMeter?: number;
  maxFloorAreaSquareMeter?: number;
  minPricePerMonth?: number;
  maxPricePerMonth?: number;
  minNumOfRooms?: number;
  maxNumOfRooms?: number;
  sortedBy?: 'nearest';
  longitude?: number;
  latitude?: number;
  status?: APARTMENT_STATUS;
}

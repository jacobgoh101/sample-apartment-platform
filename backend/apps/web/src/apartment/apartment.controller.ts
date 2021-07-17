import {
  CreateApartmentDto,
  FindApartmentQueryDto,
  UpdateApartmentDto,
} from '../../../../libs/apartment/src/apartment.dto';
import { ApartmentService } from '../../../../libs/apartment/src/apartment.service';
import { ROLES } from '../../../../libs/rbac/src/rbac.constant';
import { Roles } from '../../../../libs/rbac/src/roles.decorator';
import { RolesGuard } from '../../../../libs/rbac/src/roles.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

@Controller()
export class ApartmentController {
  constructor(private readonly apartmentService: ApartmentService) {}

  @Roles(ROLES.REALTOR)
  @UseGuards(RolesGuard)
  @Post('apartments')
  createApartments(@Body(new ValidationPipe()) body: CreateApartmentDto) {
    return this.apartmentService.create(body);
  }

  @Roles(ROLES.REALTOR)
  @UseGuards(RolesGuard)
  @Put('apartments/:id')
  updateApartments(
    @Param('id') id: number,
    @Body(new ValidationPipe()) body: UpdateApartmentDto,
  ) {
    return this.apartmentService.update(id, body);
  }

  @Get('apartments')
  getApartments(
    @Query(new ValidationPipe())
    query: FindApartmentQueryDto,
    @Req() req,
  ) {
    return this.apartmentService.find(query, req.user);
  }

  @Get('apartments/:id')
  getApartmentById(@Param('id') id: number) {
    return this.apartmentService.findById(id);
  }

  @Roles(ROLES.REALTOR)
  @UseGuards(RolesGuard)
  @Delete('apartments/:id')
  deleteApartments(@Param('id') id: number) {
    return this.apartmentService.delete(id);
  }

  @Roles(ROLES.REALTOR)
  @UseGuards(RolesGuard)
  @Get('realtors')
  getAllRealtors() {
    return this.apartmentService.getAllRealtors();
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(RolesGuard)
  @Get('realtors/:id/apartments')
  getApartmentsByRealtors(@Param('id') id: number) {
    return this.apartmentService.findApartmentsByRealtor(id);
  }
}

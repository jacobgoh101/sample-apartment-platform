import { LoginGuard } from '../../../../libs/account/src/auth/login.guard';
import {
  SignUpDto,
  UpdateUserDto,
} from '../../../../libs/account/src/user/user.dto';
import { UserModel } from '../../../../libs/account/src/user/user.model';
import { UserService } from '../../../../libs/account/src/user/user.service';
import { ROLES } from '../../../../libs/rbac/src/rbac.constant';
import { Roles } from '../../../../libs/rbac/src/roles.decorator';
import { RolesGuard } from '../../../../libs/rbac/src/roles.guard';
import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/users')
  async signUp(@Body(new ValidationPipe()) body: SignUpDto, @Req() req) {
    const isEmailUsed = await this.userService.isEmailUsed({
      email: body.email,
    });
    if (isEmailUsed) {
      throw new ConflictException(
        'Email is already used by an existing account.',
      );
    }
    const user = await this.userService.create(body);
    return new Promise((resolve, reject) => {
      req.login(user, (err) => {
        if (err) reject(err);
        resolve(user);
      });
    });
  }

  @UseGuards(LoginGuard)
  @Post('/sessions')
  login() {
    return;
  }

  @Get('/me')
  getProfile(@Req() req) {
    return req.user as UserModel;
  }

  @Delete('/sessions')
  logout(@Req() req) {
    req.logout();
    return;
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(RolesGuard)
  @Get('users')
  getUsers(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.userService.paginate({ page, limit });
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(RolesGuard)
  @Get('users/:id')
  getUsersById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOneById(id);
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(RolesGuard)
  @Delete('users/:id')
  deleteUsers(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(RolesGuard)
  @Put('users/:id')
  editUsers(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) body: UpdateUserDto,
  ) {
    return this.userService.update(id, body);
  }
}

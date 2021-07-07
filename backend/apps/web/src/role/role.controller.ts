import { RbacService } from '../../../../libs/rbac/src/rbac.service';
import { Controller, Get, Req } from '@nestjs/common';

@Controller('roles')
export class RoleController {
  constructor(private readonly rbacService: RbacService) {}

  @Get()
  getRoles(@Req() req) {
    return req.user?.id ? this.rbacService.getRolesForUser(req.user?.id) : [];
  }
}

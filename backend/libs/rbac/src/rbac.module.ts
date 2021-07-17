import { RbacEventHandler } from './rbac.event';
import { casbinProviders } from './rbac.provider';
import { RbacService } from './rbac.service';
import { Module, OnModuleInit } from '@nestjs/common';

@Module({
  providers: [...casbinProviders, RbacService, RbacEventHandler],
  exports: [...casbinProviders, RbacService],
})
export class RbacModule implements OnModuleInit {
  constructor(private readonly rbacService: RbacService) {}

  onModuleInit() {
    this.rbacService.seedPolicies();
  }
}

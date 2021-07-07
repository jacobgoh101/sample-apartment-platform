import { Module, OnModuleInit } from '@nestjs/common';
import { casbinProviders } from './rbac.provider';
import { RbacService } from './rbac.service';
import { RbacEventHandler } from './rbac.event';

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

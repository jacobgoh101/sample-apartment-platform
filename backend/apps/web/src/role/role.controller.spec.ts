import { CASBIN_PROVIDERS } from '../../../../libs/rbac/src/rbac.constant';
import { casbinEnforcerMockFactory } from '../../../../libs/rbac/src/rbac.provider-fake';
import { RbacService } from '../../../../libs/rbac/src/rbac.service';
import { RoleController } from './role.controller';
import { Test, TestingModule } from '@nestjs/testing';

describe('RoleController', () => {
  let controller: RoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RbacService,
        {
          provide: CASBIN_PROVIDERS.CASBIN_ENFORCER,
          useFactory: casbinEnforcerMockFactory,
        },
      ],
      controllers: [RoleController],
    }).compile();

    controller = module.get<RoleController>(RoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array', () => {
    const roles = controller.getRoles({ user: { id: 1 } });
    expect(roles).toBeDefined();
    expect(roles).toEqual(expect.arrayContaining([]));
  });
});

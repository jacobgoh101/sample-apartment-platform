import { CASBIN_PROVIDERS } from './rbac.constant';
import { casbinEnforcerMockFactory } from './rbac.provider-fake';
import { RbacService } from './rbac.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('RbacService', () => {
  let service: RbacService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RbacService,
        {
          provide: CASBIN_PROVIDERS.CASBIN_ENFORCER,
          useFactory: casbinEnforcerMockFactory,
        },
      ],
    }).compile();

    service = module.get<RbacService>(RbacService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('can get roles for user', () => {
    const roles = service.getRolesForUser(1);
    expect(roles).toBeDefined();
    expect(roles).toEqual(expect.arrayContaining([]));
  });
});

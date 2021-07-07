/* eslint-disable @typescript-eslint/ban-ts-comment */
import { UserModel } from './user.model';
import { mockSignUpDto } from './user.repo-fake';
import { mockUser } from './user.repo-fake';
import { UserService } from './user.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [
        UserService,
        {
          provide: UserModel.name,
          useValue: UserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('can create user', async () => {
    const user = await service.create(mockSignUpDto);
    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    //@ts-ignore
    expect(user.password).toBeUndefined();
    //@ts-ignore
    expect(user.passwordHash).toBeUndefined();
  });

  it('can find user by email', async () => {
    const user = await service.findOneByEmail(mockUser.email);
    expect(user.id).toBeDefined();
  });
});

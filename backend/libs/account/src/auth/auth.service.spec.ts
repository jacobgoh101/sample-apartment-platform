import { ENV } from '../../../config/env';
import { UserModel } from '../user/user.model';
import { mockSignUpDto } from '../user/user.repo-fake';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { SessionModel } from './session.model';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import Knex from 'knex';
import { knexSnakeCaseMappers } from 'objection';

describe('AuthService', () => {
  let service: AuthService;
  let knex: any;

  beforeEach(async () => {
    knex = Knex({
      client: 'pg',
      connection: {
        host: ENV.DB_HOST,
        port: +ENV.DB_PORT,
        user: ENV.DB_USERNAME,
        password: ENV.DB_PASSWORD,
        database: ENV.DB_NAME,
      },
      debug: process.env.KNEX_DEBUG === 'true',
      ...knexSnakeCaseMappers(),
    });

    const module: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [
        AuthService,
        UserService,
        {
          provide: UserModel.name,
          useFactory: () => {
            UserModel.knex(knex);
            return UserModel;
          },
        },
        {
          provide: SessionModel.name,
          useFactory: () => {
            SessionModel.knex(knex);
            return SessionModel;
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('can validate valid email & password', async () => {
    const user = await service.validateUser(
      mockSignUpDto.email,
      mockSignUpDto.password,
    );
    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
  });

  it('can validate invalid email & password', async () => {
    const user = await service.validateUser(
      mockSignUpDto.email,
      'wrongpassword',
    );
    expect(user).toBeNull();
  });
});

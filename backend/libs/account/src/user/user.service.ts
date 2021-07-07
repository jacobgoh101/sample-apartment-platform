import {
  IPaginationOptions,
  Pagination,
} from '../../../types/pagination.types';
import { BCRYPT } from '../../../util/bcrypt.util';
import { SessionModel } from '../auth/session.model';
import { USER_EVENT } from './user.constant';
import { SignUpDto, SignupEventDto, UpdateUserDto } from './user.dto';
import { UserModel } from './user.model';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';
import { omit } from 'lodash';
import { ModelClass } from 'objection';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserModel')
    private readonly userModel: ModelClass<UserModel>,
    @Inject('SessionModel')
    private readonly sessionModel: ModelClass<SessionModel>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(data: SignUpDto) {
    const { email, name, password } = data;
    const passwordHash = await BCRYPT.hashPassword(password);
    const user = await this.userModel
      .query()
      .insert({ email, passwordHash, name })
      .returning('*');

    this.eventEmitter.emit(USER_EVENT.SIGNUP, {
      user,
    } as SignupEventDto);

    return user;
  }

  async upsertWithoutPassword(data: Omit<SignUpDto, 'password'>) {
    const { email, name } = data;
    const user = await this.userModel
      .query()
      .insert({ email, name })
      .onConflict('email')
      .merge();

    this.eventEmitter.emit(USER_EVENT.SIGNUP, {
      user,
    } as SignupEventDto);

    return user;
  }

  async isEmailUsed({ email }: { email: string }): Promise<boolean> {
    const emailExist = await this.userModel
      .query()
      .where('email', email)
      .resultSize()
      .then((c) => c > 0);
    if (emailExist) return true;
    return false;
  }

  async findOneById(id: number) {
    return this.userModel.query().findById(id);
  }

  async findOneByEmail(email: string) {
    return this.userModel.query().findOne({ email });
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<UserModel>> {
    const { page, limit } = options;
    const { results, total } = await this.userModel.query().page(+page, +limit);
    return {
      items: results,
      meta: {
        currentPage: +page,
        itemsPerPage: +limit,
        totalItems: total,
        totalPages: Math.ceil(total / +limit),
        itemCount: results.length,
      },
    };
  }

  async delete(id: number) {
    return this.userModel.query().deleteById(id);
  }

  async update(id: number, body: UpdateUserDto) {
    const passwordHash = body.password
      ? await BCRYPT.hashPassword(body.password)
      : undefined;
    if (body.password) this.deleteUserSessions(id);
    const trimmedBody = omit(body, 'password');
    return this.userModel
      .query()
      .updateAndFetchById(id, { ...trimmedBody, passwordHash });
  }

  async deleteUserSessions(userId: number) {
    return this.sessionModel
      .query()
      .whereRaw(`cast("json"->'passport'->'user'->>'id' as int) = ?`, [userId])
      .delete();
  }
}

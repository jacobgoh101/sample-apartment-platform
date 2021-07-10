import { ENV } from '../../../config/env';
import { NotificationService } from '../../../notification/src/notification.service';
import {
  IPaginationOptions,
  Pagination,
} from '../../../types/pagination.types';
import { BCRYPT } from '../../../util/bcrypt.util';
import { SessionModel } from '../auth/session.model';
import { EmailVerificationModel } from './email-verification.model';
import { USER_EVENT } from './user.constant';
import { SignUpDto, SignupEventDto, UpdateUserDto } from './user.dto';
import { UserModel } from './user.model';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';
import * as cryptoRandomString from 'crypto-random-string';
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
    @Inject('EmailVerificationModel')
    private readonly emailVerificationModel: ModelClass<EmailVerificationModel>,
    private readonly eventEmitter: EventEmitter2,
    private readonly notificationService: NotificationService,
  ) {}

  async create(data: SignUpDto) {
    const { email, name, password } = data;
    const passwordHash = await BCRYPT.hashPassword(password);
    const user = await this.userModel
      .query()
      .insert({ email, passwordHash, name, emailVerified: false })
      .returning('*');

    this.eventEmitter.emit(USER_EVENT.SIGNUP, {
      user,
    } as SignupEventDto);

    return user;
  }

  async createByGoogle(
    data: Pick<UserModel, 'email' | 'name' | 'googleAccountId'>,
  ) {
    const { email, name, googleAccountId } = data;

    if (
      (await this.userModel.query().where({ googleAccountId }).resultSize()) > 0
    ) {
      throw new ConflictException(
        'This Google account had signed up before. Please Log In.',
      );
    }

    const user = await this.userModel
      .query()
      .insert({ email, name, googleAccountId, emailVerified: true })
      .returning('*');

    this.eventEmitter.emit(USER_EVENT.SIGNUP, {
      user,
    } as SignupEventDto);

    return user;
  }

  findByGoogle(googleAccountId: string) {
    return this.userModel.query().findOne({ googleAccountId });
  }

  async createByFacebook(
    data: Pick<UserModel, 'email' | 'name' | 'facebookAccountId'>,
  ) {
    const { email, name, facebookAccountId } = data;

    if (
      (await this.userModel.query().where({ facebookAccountId }).resultSize()) >
      0
    ) {
      throw new ConflictException(
        'This Facebook account had signed up before. Please Log In.',
      );
    }

    const user = await this.userModel
      .query()
      .insert({ email, name, facebookAccountId, emailVerified: true })
      .returning('*');

    this.eventEmitter.emit(USER_EVENT.SIGNUP, {
      user,
    } as SignupEventDto);

    return user;
  }

  findByFacebook(facebookAccountId: string) {
    return this.userModel.query().findOne({ facebookAccountId });
  }

  async isEmailUsed({ email }: { email: string }): Promise<boolean> {
    return (
      (await this.userModel
        .query()
        .where('email', email)
        .whereNull('googleAccountId')
        .whereNull('facebookAccountId')
        .resultSize()) > 0
    );
  }

  async findOneById(id: number) {
    return this.userModel.query().findById(id);
  }

  async findOneByEmail(email: string) {
    return this.userModel.query().findOne({ email });
  }

  async findOneNonSocialUserByEmail(email: string) {
    return this.userModel
      .query()
      .findOne({ email })
      .whereNull('googleAccountId')
      .whereNull('facebookAccountId');
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

  async createAndSendEmailVerification(user: UserModel) {
    const { email, emailVerified, id: userId } = user;
    if (emailVerified) return;

    const token = cryptoRandomString({ length: 32 });
    await this.emailVerificationModel.query().insert({
      email,
      userId,
      token,
    });

    const verificationUrl = `${
      ENV.FRONTEND_HOSTNAME
    }/email/verify?token=${encodeURIComponent(token)}&userId=${userId}`;

    this.notificationService.sendEmailVerification({
      name: user.name,
      email: user.email,
      verificationUrl,
    });
  }

  async verifyEmail(token: string, userId: number) {
    const emailVerification = await this.emailVerificationModel
      .query()
      .findOne({ token, userId });

    if (!emailVerification || emailVerification.expiredAt < new Date()) {
      throw new UnauthorizedException('Invalid Token');
    }

    await emailVerification
      .$relatedQuery<UserModel>('user')
      .update({ emailVerified: true });

    if (!emailVerification.verifiedAt)
      return emailVerification.$query().updateAndFetch({
        verifiedAt: emailVerification.verifiedAt || new Date(),
      });
    return emailVerification;
  }

  async blockUser(userId: number) {
    return this.userModel.query().updateAndFetchById(userId, { blocked: true });
  }

  async unblockUser(userId: number) {
    return this.userModel
      .query()
      .updateAndFetchById(userId, { blocked: false });
  }
}

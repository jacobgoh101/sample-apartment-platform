import { USER_EVENT } from './user.constant';
import { UserModel } from './user.model';
import { UserService } from './user.service';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class UserEventHandler {
  constructor(private readonly userService: UserService) {}

  @OnEvent(USER_EVENT.SIGNUP)
  async handleUserSignupEvent({ user }: { user: UserModel }) {
    if (!user.emailVerified) {
      await this.userService.createAndSendEmailVerification(user);
    }
    return user;
  }
}

import { USER_EVENT } from '../../account/src/user/user.constant';
import { SignupEventDto } from '../../account/src/user/user.dto';
import {
  getResourceId,
  RESOURCE,
  ROLES,
  RESOURCE_ACTION,
} from './rbac.constant';
import { RbacService } from './rbac.service';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class RbacEventHandler {
  constructor(private readonly rbacService: RbacService) {}

  @OnEvent(USER_EVENT.SIGNUP)
  async handleUserSignupEvent(payload: SignupEventDto) {
    return payload;
  }
}
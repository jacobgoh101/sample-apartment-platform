/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Model } from 'objection';

export class BaseModel extends Model {
  readonly id: number;
  createdAt: Date;
  updatedAt: Date;

  $beforeInsert() {
    //@ts-ignore
    this.createdAt = new Date().toISOString();
    //@ts-ignore
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    //@ts-ignore
    this.updatedAt = new Date().toISOString();
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import db from '../database/postgres';
import { follows } from './follow.schema';

@Injectable()
export default class FollowService {
  constructor() {}
  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new HttpException('Cannot follow yourself', HttpStatus.BAD_REQUEST);
    }
    await db
      .insert(follows)
      .values({
        followerId,
        followingId,
      })
      //.onConflictDoNothing()
      .catch((err) => {
        console.error(err);
      });
    return { type: 'follow' };
  }
}

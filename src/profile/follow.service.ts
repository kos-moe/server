import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
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
  async getFollowers(accountId: string) {
    return (
      await db.select().from(follows).where(eq(follows.followingId, accountId))
    ).map((follow) => follow.followerId);
  }
}

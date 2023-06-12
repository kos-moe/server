import { Injectable } from '@nestjs/common';
import redis from '../database/redis';
import FollowService from '../profile/follow.service';
import { decodeTime } from 'ulid';
import StatusService from './status.service';
import { createStatusDto } from './status.dto';

@Injectable()
export default class TimelineService {
  constructor(private Follow: FollowService, private Status: StatusService) {}
  async write(profileId: string, data: createStatusDto) {
    const statusId = await this.Status.create(profileId, data);
    await this.publish(profileId, statusId);
    return statusId;
  }
  async publish(profileId: string, statusId: string) {
    const followers = await this.Follow.getFollowers(profileId);
    const pipeline = redis.pipeline();
    followers.forEach((followerId) => {
      pipeline.zadd(
        `timeline:home:${followerId}`,
        decodeTime(statusId),
        statusId,
      );
    });
    await pipeline.exec();
  }
  async getHomeTimeline(profileId: string, cursor: string, limit = 50) {
    const key = `timeline:home:${profileId}`;
    let statusIds: string[];
    if (cursor) {
      statusIds = await redis.zrevrangebyscore(
        key,
        `(${decodeTime(cursor)}`,
        '-inf',
        'LIMIT',
        0,
        limit,
      );
    } else {
      statusIds = await redis.zrevrange(key, 0, limit);
    }
    const statuses = await this.Status.getMany(statusIds);
    return {
      statuses,
      cursor: statusIds[statusIds.length - 1],
      hasMore: statusIds.length === limit,
    };
  }
}

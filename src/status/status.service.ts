import { Injectable } from '@nestjs/common';
import { eq, inArray } from 'drizzle-orm';
import { profiles } from '../profile/profile.schema';
import { ulid } from 'ulid';
import db from '../database/postgres';
import { createStatusDto } from './status.dto';
import { statuses } from './status.schema';

@Injectable()
export default class StatusService {
  constructor() {}
  async create(profileId: string, data: createStatusDto) {
    const id = ulid();
    await db.insert(statuses).values({
      id,
      profileId,
      content: data.content,
    });
    return id;
  }
  async get(id: string) {
    return (await db.select().from(statuses).where(eq(statuses.id, id)))[0];
  }
  async getMany(ids: string[]) {
    if (ids.length === 0) return [];
    const result = await db
      .select({
        status: statuses,
        profile: {
          id: profiles.id,
          name: profiles.name,
          handle: profiles.handle,
        },
      })
      .from(statuses)
      .innerJoin(profiles, eq(statuses.profileId, profiles.id))
      .where(inArray(statuses.id, ids));
    return result.map((row) => {
      return {
        ...row.status,
        profile: row.profile,
      };
    });
  }
}

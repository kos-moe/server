import { Injectable } from '@nestjs/common';
import SessionService from '../session/session.service';

@Injectable()
export default class AuthService {
  constructor(private Session: SessionService) {}

  async validateUser(sessionId: string): Promise<any> {
    const session = await this.Session.get(sessionId);
    return session || null;
  }
}

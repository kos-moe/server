import { Injectable } from '@nestjs/common';
import AccountService from '../account/service';
import SessionService from '../session/service';

@Injectable()
export default class AuthService {
  constructor(
    private Session: SessionService,
    private Account: AccountService,
  ) {}

  async validateUser(sessionId: string): Promise<any> {
    const session = await this.Session.get(sessionId);
    return session || null;
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { verify } from '@node-rs/argon2';
import { randomInt } from 'crypto';
import AccountService from '../account/account.service';
import redis from '../database/redis';
import MailerService from '../mailer/mailer.service';
import InternalSessionService from './internal-session.service';

type EmailVerificationRedisType = {
  verificationCode: string;
  createdAt: number;
  resendCount: number;
};

function calcurateResendTime(createdAt: number, resendCount: number) {
  return createdAt + 5 ** resendCount * 1000 * 60;
}

@Injectable()
export default class LoginService {
  constructor(
    private Account: AccountService,
    private InternalSession: InternalSessionService,
    private Mailer: MailerService,
  ) {}
  async login(email: string, password: string) {
    const account = await this.Account.getFromEmail(email).catch(() => {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    });
    if (!(await verify(account.authenticator.password, password))) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return await this.InternalSession.create(account.id);
  }

  async sendVerificationEmail(email: string) {
    let resendCount = 0;
    const existedVerification: EmailVerificationRedisType = JSON.parse(
      (await redis.get(`email:verification:${email}`)) || null,
    );
    if (existedVerification) {
      if (
        calcurateResendTime(
          existedVerification.createdAt,
          existedVerification.resendCount,
        ) > Date.now()
      ) {
        throw new HttpException(null, HttpStatus.TOO_MANY_REQUESTS);
      }
      resendCount = existedVerification.resendCount + 1;
    }
    const verificationCode = randomInt(100000000).toString().padStart(8, '0');
    const createdAt = Date.now();
    await this.Mailer.send(
      'no-reply@kos.moe',
      email,
      `kos.moe 회원가입 인증 이메일 [${verificationCode}]`,
      `인증 코드는 ${verificationCode} 입니다.\r\n인증 코드를 입력하시거나 이 링크를 클릭해주세요: https://kos.moe/register?email=${email}&authCode=${verificationCode}`,
    );
    await redis.set(
      `email:verification:${email}`,
      JSON.stringify({
        verificationCode: verificationCode,
        createdAt,
        resendCount,
      }),
    );
    await redis.expire(`email:verification:${email}`, 60 * 60);
    return {
      resendTime: new Date(calcurateResendTime(createdAt, resendCount)),
    };
  }
  async checkVerificationCode(email: string, verificationCode: string) {
    const existedVerification: EmailVerificationRedisType = JSON.parse(
      (await redis.get(`email:verification:${email}`)) || null,
    );
    if (!existedVerification) {
      throw new HttpException(null, HttpStatus.FORBIDDEN);
    }
    if (
      existedVerification.verificationCode !== verificationCode ||
      existedVerification.createdAt + 1000 * 60 * 60 < Date.now()
    ) {
      throw new HttpException(null, HttpStatus.FORBIDDEN);
    }
  }
}

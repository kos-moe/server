import { IsEmail, Length } from 'class-validator';

export class CreateAccountDto {
  @IsEmail()
  email: string;
  @Length(8, 8)
  verificationCode: string;
  @Length(1, 20)
  name: string;
  @Length(8)
  password: string;
}

import { PartialType } from '@nestjs/mapped-types';
import { RegisterUserDto } from '.';
import { IsArray, IsEmail, IsString } from 'class-validator';
import { IRole } from 'src/user/interfaces/role.interface';

export class UpdateUserDto extends PartialType(RegisterUserDto) {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsArray()
  roles: IRole[];
}

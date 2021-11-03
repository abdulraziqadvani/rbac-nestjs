import { IsArray, IsEmail, IsString, ValidateNested } from 'class-validator';
import { IRole } from 'src/user/interfaces/role.interface';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsArray()
  @ValidateNested({ each: true })
  roles: IRole[];
}

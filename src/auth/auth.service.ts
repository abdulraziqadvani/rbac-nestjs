import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IPayload } from 'src/shared/interfaces/payload.interface';
import { IUser } from 'src/user/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  /**
   * Validates user
   * @param email - Email of a User based on which to be validated.
   * @param password - Password of a User based on which to be validated.
   * @returns Returns User Object
   */
  async validateUser(email: string, password: string): Promise<IUser> {
    const user: IUser = await this.userService.findByEmail(email);

    if (!user) {
      throw new HttpException(`User doesn't Exist.`, HttpStatus.BAD_REQUEST);
    }

    if (await bcrypt.compare(password, user.password)) {
      return user;
    } else {
      throw new HttpException('Invalid Credentials', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Logins User and generate Access Token
   * @param user - Object of a User.
   * @returns Returns User object along with Access Token.
   */
  async login(user: any): Promise<any> {
    const payload = { email: user.email, sub: user.userId };
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Create a User account.
   * @param registerUserDto - User information based on which account have to be created
   * @returns Returns User object along with Access Token.
   */
  async register(registerUserDto: RegisterUserDto): Promise<any> {
    const { email } = registerUserDto;
    const createdUser = await this.userService.create(registerUserDto);

    const token = await this.signPayload({ email });
    return { user: this.sanitizeUser(createdUser), access_token: token };
  }

  /**
   * Creates a JWT Token based on Payload Provided.
   * @param payload - Contains information which have to be in token
   * @returns Returns JWT Token.
   */
  async signPayload(payload: IPayload): Promise<any> {
    return this.jwtService.sign(payload);
  }

  /**
   * Return user object without password
   * @param user - User Data.
   * @returns Returns user data without Password
   */
  sanitizeUser(user: IUser): any {
    delete user.password;
    return user;
  }
}

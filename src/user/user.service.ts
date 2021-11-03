import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailerService } from 'src/shared/services/mailer.service';
import { RegisterUserDto, UpdateUserDto } from './dto';
import { IUser } from './interfaces/user.interface';

import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly mailerService: MailerService
  ) {
  }

  /**
   * Create a User account.
   * @param registerUserDto - User information based on which account have to be created
   * @returns Returns User object along with Access Token.
   */
  async create(registerUserDto: RegisterUserDto): Promise<IUser> {
    const { email } = registerUserDto;
    const user: IUser = await this.userModel.findOne({ email });
    if (user) {
      throw new HttpException('User already Exist.', HttpStatus.BAD_REQUEST);
    }
    const createdUser = new this.userModel(registerUserDto);
    await createdUser.save();

    return createdUser.toObject();
  }

  /**
   * Find a User based on email.
   * @param email - Email based on which user needs to be find.
   * @returns Returns User data.
   */
  async findByEmail(email: string): Promise<IUser> {
    return await this.userModel.findOne({ email }).lean();
  }

  /**
   * Updates a User account.
   * @param id - User Object ID based on which user have to be updated.
   * @param updateUserDto - User object which to be updated.
   * @returns Returns updated user data.
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<IUser> {
    const oldUser: IUser = await this.userModel.findById(id);
    await this.userModel.updateOne({ _id: id }, updateUserDto);
    const updatedUser: IUser = await this.userModel.findById(id);

    // Send Email to a user regarding profile updated.
    this.mailerService.sendMail([oldUser.email], 'User Profile is Updated', 'Your User Information is Updated.');

    // If email is changed then send email to new email and acknowledging them.
    if (oldUser.email !== updatedUser.email) {
      this.mailerService.sendMail([updatedUser.email], 'User Profile is Updated', 'This is your new address registered in a system.');
    }

    return updatedUser;
  }
}

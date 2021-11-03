import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { IRole } from '../interfaces/role.interface';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  roles: IRole[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// NOTE: Arrow functions are not used here as we do not want to use lexical scope for 'this'
UserSchema.pre('save', function (next) {
  // Make sure not to rehash the password if it is already hashed
  if (!this.isModified('password')) return next();

  // Generate a salt and use it to hash the user's password
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(this['password'], salt, (err, hash) => {
      if (err) return next(err);
      this['password'] = hash;
      next();
    });
  });
});

UserSchema.methods.checkPassword = function (attempt, callback) {
  bcrypt.compare(attempt, this['password'], (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

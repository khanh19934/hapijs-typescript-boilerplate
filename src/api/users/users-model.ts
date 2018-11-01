import * as Mongoose from 'mongoose';
import * as Bcrypt from 'bcryptjs';

export interface IUser extends Mongoose.Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updateAt: Date;
  validatePassword(requestPassword): boolean;
}

const UserSchema = new Mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true
    },
    name: {
      type: String
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

function hashPassword(password: string) {
  if (!password) {
    return null;
  }

  return Bcrypt.hashSync(password, Bcrypt.genSaltSync(8));
}

UserSchema.methods.validatePassword = function(requestPassword) {
  return Bcrypt.compareSync(requestPassword, this.password);
};

UserSchema.pre('save', function(next) {
  const user = this;

  if (!user.isModified) {
    return next();
  }

  user['password'] = hashPassword(user['password']);

  return next();
});

export const UserModel = Mongoose.model<IUser>('User', UserSchema);

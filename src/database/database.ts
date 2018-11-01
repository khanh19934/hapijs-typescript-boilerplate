import * as Mongoose from 'mongoose';
import { IUser } from '../api/users/users-model';

import { UserModel } from '../api/users/users-model';
import { IDataConfiguration } from '../configs';

export interface IDatabase {
  userModel: Mongoose.Model<IUser>;
}

export const init = (config: IDataConfiguration) => {
  Mongoose.set('useFindAndModify', false);
  Mongoose.set('useCreateIndex', true);
  Mongoose.connect(
    config.connectionString,
    { useNewUrlParser: true }
  );

  let mongoDb = Mongoose.connection;

  mongoDb.on('error', () => {
    console.log('Unable to connect database');
  });

  mongoDb.once('open', () => {
    console.log(`Connected to database`);
  });

  return {
    userModel: UserModel
  };
};

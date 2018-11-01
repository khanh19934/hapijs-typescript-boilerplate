import * as Hapi from 'hapi';
import * as Boom from 'boom';

import * as Jwt from 'jsonwebtoken';

import { IDatabase } from '../../database/database';
import { IUser } from './users-model';
import { IRequest, ILoginRequest } from '../../interfaces/request';
import { IServerConfigurations } from '../../configs';

export default class UserController {
  private database: IDatabase;
  private configs: IServerConfigurations;
  constructor(database: IDatabase, configs: IServerConfigurations) {
    this.database = database;
    this.configs = configs;
  }

  private generateToken = (user: IUser) => {
    const jwtSecret = this.configs.jwtSecret;
    const jwtExpiration = this.configs.jwtExpiration;
    const payload = { id: user._id };
    return Jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiration });
  };

  public loginUser = async (request: ILoginRequest, h: Hapi.ResponseToolkit) => {
    const { email, password } = request.payload;

    let user: IUser = await this.database.userModel.findOne({ email });

    if (!user) {
      return Boom.unauthorized('User does not exist');
    }

    if (!user.validatePassword(password)) {
      return Boom.unauthorized('Password is invalid');
    }

    return h.response({ token: this.generateToken(user) }).code(200);
  };

  public createUser = async (request: IRequest, h: Hapi.ResponseToolkit) => {
    try {
      let newUser: IUser = await this.database.userModel.create(request.payload);
      return h.response({ token: this.generateToken(newUser) }).code(200);
    } catch (error) {
      return Boom.badImplementation(error);
    }
  };

  public updateUser = async (request: IRequest, h: Hapi.ResponseToolkit) => {
    const id = request.auth.credentials.id;
    try {
      let user: IUser = await this.database.userModel.findByIdAndUpdate(
        id,
        { $set: request.payload },
        { new: true }
      );

      let newUser = await user.save();

      return newUser;
    } catch (e) {
      return Boom.badImplementation(e);
    }
  };
}

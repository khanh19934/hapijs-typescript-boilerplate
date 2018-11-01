import * as Hapi from 'hapi';
import { IDatabase } from '../../database/database';
import * as Joi from 'joi';

import * as UserValidator from './users-validator';

import UserController from './user-controller';
import { IServerConfigurations } from '../../configs';

const userRoutes = (
  server: Hapi.Server,
  database: IDatabase,
  configs: IServerConfigurations
) => {
  const userController = new UserController(database, configs);
  server.bind(userController);

  server.route({
    method: 'POST',
    path: '/users/login',

    options: {
      handler: userController.loginUser,
      auth: false,
      tags: ['api', 'users'],
      validate: {
        payload: UserValidator.loginUserModel
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': {
              description: 'User created.'
            }
          }
        }
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/users/signup',
    options: {
      handler: userController.createUser,
      tags: ['api', 'users'],
      auth: false,
      validate: {
        payload: UserValidator.createUserModel
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'User created.'
            }
          }
        }
      }
    }
  });

  server.route({
    method: 'PUT',
    path: '/users/update-user',
    options: {
      handler: userController.updateUser,
      auth: 'jwt',
      tags: ['api', 'users'],
      validate: {
        payload: UserValidator.updateUserModel
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': {
              description: 'User created.'
            }
          }
        }
      }
    }
  });
};

export default userRoutes;

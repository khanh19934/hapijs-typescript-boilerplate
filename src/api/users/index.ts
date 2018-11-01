import * as Hapi from 'hapi';
import UserRoutes from './users-routes';
import { IServerConfigurations } from '../../configs';

export const init = (server: Hapi.Server, database, configs: IServerConfigurations) => {
  UserRoutes(server, database, configs);
};

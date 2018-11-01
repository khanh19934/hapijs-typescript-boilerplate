import * as Hapi from 'hapi';
import { IDatabase } from './database/database';

import { IServerConfigurations } from './configs';
import * as User from './api/users';

interface IConfig {
  port: number;
  host: any;
}

const init = async (
  configs: IServerConfigurations,
  database: IDatabase
): Promise<Hapi.Server> => {
  const server = new Hapi.Server({
    port: configs.port,
    host: 'localhost'
  });

  server.route({
    path: '/',
    method: 'GET',
    handler: (request, h) => {
      return 'Hello world';
    }
  });

  const plugins: Array<string> = configs.plugins;

  const pluginOptions = {
    database: database,
    serverConfigs: configs
  };

  let pluginPromises: Promise<any>[] = [];

  plugins.forEach((pluginName: string) => {
    var plugin: any = require('./plugins/' + pluginName).default();
    console.log(`Register Plugin ${plugin.info().name} v${plugin.info().version}`);
    pluginPromises.push(plugin.register(server, pluginOptions));
  });

  await Promise.all(pluginPromises);

  User.init(server, database, configs);

  return server;
};

export default init;

import Server from './app';

import * as Database from './database/database';

import * as Configs from './configs';

const start = async db => {
  const server = await Server(Configs.getServerConfigs(), db);

  await server.start();
  console.log(`Server is running at ${server.info.uri}`);
};
const database = Database.init(Configs.getDatabaseConfig());

start(database);

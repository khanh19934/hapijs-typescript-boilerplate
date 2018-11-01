import * as Hapi from 'hapi';
import { IDatabase } from '../database/database';
import { IServerConfigurations } from '../configs/index';

export interface IPluginOptions {
  database: IDatabase;
  serverConfigs: IServerConfigurations;
}

export interface IPlugin {
  register(server: Hapi.Server, options?: IPluginOptions): Promise<void>;
  info(): IPluginInfo;
}

export interface IPluginInfo {
  name: string;
  version: string;
}

import * as Hapi from 'hapi';

const register = async (server: Hapi.Server): Promise<void> => {
  try {
    return server.register([
      require('inert'),
      require('vision'),
      {
        plugin: require('hapi-swagger'),

        options: {
          info: {
            title: 'Test Api',
            description: 'Test Api Documentation',
            version: '1.0'
          },
          tags: [
            {
              name: 'users',
              description: 'API User interface'
            }
          ],
          swaggerUI: true,
          documentationPage: true,
          documentationPath: '/docs',
          securityDefinitions: {
            jwt: {
              type: 'apiKey',
              name: 'Authorization',
              in: 'header'
            }
          }
        }
      }
    ]);
  } catch (e) {
    console.log(e);
  }
};

export default () => ({
  register,
  info: () => {
    return {
      name: 'Swagger Documentation',
      version: '1.0.0'
    };
  }
});

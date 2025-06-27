import { envSchema } from '@config/env.schema';

export default () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    console.error(result.error.format());
    throw new Error('Invalid environment variables');
  }
  return {
    app: {
      port: result.data.PORT,
      env: result.data.NODE_ENV,
      apiVersion: result.data.API_VERSION,
      frontUrl: result.data.FRONT_HTTP,
    },
    database: {
      connectionUri: result.data.CONNECTION_URL,
    },
    jwt: {
      accessSecret: result.data.JWT_ACCESS_SECRET,
      accessExpiration: result.data.JWT_ACCESS_EXPIRATION,
      refreshSecret: result.data.JWT_REFRESH_SECRET,
      refreshExpiration: result.data.JWT_REFRESH_EXPIRATION,
    },
  };
};

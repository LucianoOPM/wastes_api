export default () => ({
  port: parseInt(process.env.PORT!, 10) || 3000,
  connectionUrl: process.env.CONNECTION_URL!,
  apiVersion: process.env.API_VERSION!,
  jwt: {
    accessToken: process.env.JWT_ACCESS_SECRET!,
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION!,
    refreshToken: process.env.JWT_REFRESH_SECRET!,
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION!,
  },
});

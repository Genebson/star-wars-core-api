export const environmentConfig = () => ({
  app: {
    nodeEnv: process.env.NODE_ENV,
  },
  database: {
    port: Number(process.env.DB_PORT),
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  api: {
    starWars: process.env.STAR_WARS_API,
  },
});

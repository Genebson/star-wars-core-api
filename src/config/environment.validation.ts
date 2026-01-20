import * as joi from 'joi';

export const environmentValidation = joi.object({
  PORT: joi.number().required(),
  NODE_ENV: joi.string().required(),
  DB_PORT: joi.number().required(),
  DB_HOST: joi.string().required(),
  DB_USERNAME: joi.string().required(),
  DB_PASSWORD: joi.string().required(),
  DB_NAME: joi.string().required(),
  JWT_SECRET: joi.string().required(),
});

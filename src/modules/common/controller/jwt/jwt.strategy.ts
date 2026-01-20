import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessTokenDto } from '../roles/dto/access-token.dto';

enum ENVIRONMENT {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  AUTOMATED_TEST = 'automated_tests',
}

export const AUTOMATED_TEST_JWT_SECRET = 'AUTOMATED_TEST_JWT_SECRET';

const strategyBaseConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false,
};

const strategyConfig = {
  [ENVIRONMENT.AUTOMATED_TEST]: {
    ...strategyBaseConfig,
    secretOrKey: AUTOMATED_TEST_JWT_SECRET,
  },
  [ENVIRONMENT.DEVELOPMENT]: {
    ...strategyBaseConfig,
    secretOrKey: process.env.JWT_SECRET,
  },
  [ENVIRONMENT.PRODUCTION]: {
    ...strategyBaseConfig,
    secretOrKey: process.env.JWT_SECRET,
  },
};

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super(strategyConfig[process.env.NODE_ENV]);
  }

  async validate(payload: AccessTokenDto) {
    return { email: payload.email, sub: payload.id, role: payload.role };
  }
}

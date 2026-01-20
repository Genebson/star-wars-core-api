import { CanActivate, ExecutionContext, mixin } from '@nestjs/common';
import { decode } from 'jsonwebtoken';
import { RolesType } from './enum/roles.enum';
import { AccessTokenDto } from './dto/access-token.dto';

export const RolesGuard = (roles: RolesType[]) => {
  class RolesGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const req = context.switchToHttp().getRequest();
      const decodedJwt = decode(
        (req.headers.authorization as string).split(' ')[1],
      ) as AccessTokenDto;

      if (!decodedJwt.role) {
        return false;
      }

      return roles.find((role) => role === decodedJwt.role) !== undefined;
    }
  }

  return mixin(RolesGuardMixin);
};

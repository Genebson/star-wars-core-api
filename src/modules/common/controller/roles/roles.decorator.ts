import { SetMetadata } from '@nestjs/common';
import { RolesType } from './enum/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolesType[]) => SetMetadata(ROLES_KEY, roles);

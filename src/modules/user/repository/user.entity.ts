import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../common/repository/base.entity';
import { UserRole } from './enum/user.role.enum';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ enum: UserRole, default: UserRole.REGULAR })
  role: UserRole;
}

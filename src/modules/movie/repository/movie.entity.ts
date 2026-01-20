import { BaseEntity } from '../../common/repository/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('movie')
export class MovieEntity extends BaseEntity {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  director: string;

  @Column({ nullable: false })
  openingCrawl: string;

  @Column({ nullable: false })
  releaseDate: Date;
}

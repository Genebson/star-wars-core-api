import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    nullable: true,
  })
  updatedAt: Date;

  @Column({
    nullable: true,
  })
  deletedAt: Date;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  kakaoId: string;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  profileImage?: string;
}

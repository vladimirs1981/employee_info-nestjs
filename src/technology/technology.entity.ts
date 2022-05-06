import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'technologies' })
export class TechnologyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';

@Entity({
  name: 'notes',
})
export class NoteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  createdBy: string;

  @ApiProperty({ required: true, example: 'This is note text' })
  @Column()
  text: string;

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }

  @ManyToOne(() => UserEntity, user => user.notes)
  employee: UserEntity;
}

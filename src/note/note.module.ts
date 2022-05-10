import { Module } from '@nestjs/common';
import { NoteController } from '@app/note/note.controller';
import { NoteService } from '@app/note/note.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteEntity } from '@app/note/note.entity';
import { UserEntity } from '@app/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NoteEntity, UserEntity])],
  providers: [NoteService],
  controllers: [NoteController],
})
export class NoteModule {}

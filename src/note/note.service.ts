import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NoteEntity } from '@app/note/note.entity';
import { Repository } from 'typeorm';
import { CreateNoteDto } from '@app/note/dto/createNote.dto';
import { UserEntity } from '@app/user/user.entity';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(NoteEntity) private readonly noteRepository: Repository<NoteEntity>,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}
  async findAll(): Promise<NoteEntity[]> {
    const notes = await this.noteRepository.find();
    return notes;
  }

  async createNote(currentUserId: number, createNoteDto: CreateNoteDto, employeeId: number): Promise<NoteEntity> {
    const user = await this.userRepository.findOne(currentUserId);
    const employee = await this.userRepository.findOne(employeeId);
    const note = new NoteEntity();
    Object.assign(note, createNoteDto);
    note.createdBy = `${user.firstName} ${user.lastName}`;
    note.employee = employee;
    return await this.noteRepository.save(note);
  }

  buildNoteResponse(note: NoteEntity) {
    return {
      note,
    };
  }
}

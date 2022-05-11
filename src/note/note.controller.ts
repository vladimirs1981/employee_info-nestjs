import { Controller, Get, Post, UseGuards, ParseIntPipe, Body, Param } from '@nestjs/common';
import { NoteService } from '@app/note/note.service';
import { NotesResponseInterface } from './types/notesResponse.interface';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { User } from '@app/user/decorators/user.decorator';
import { CreateNoteDto } from './dto/createNote.dto';
import { NoteResponseInterface } from './types/noteResponse.interface';
import { Roles } from '@app/user/decorators/userRoles.decorator';
import { UserRole } from '@app/user/types/userRole.enum';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  @UseGuards(AuthGuard)
  @Roles(UserRole.PROJECT_MANAGER)
  async findAll(): Promise<NotesResponseInterface> {
    const notes = await this.noteService.findAll();
    return { notes };
  }

  @Post(':employeeId')
  @UseGuards(AuthGuard)
  @Roles(UserRole.PROJECT_MANAGER)
  async create(
    @User('id', ParseIntPipe) currentUserId: number,
    @Body('note') createNoteDto: CreateNoteDto,
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<NoteResponseInterface> {
    const note = await this.noteService.createNote(currentUserId, createNoteDto, employeeId);
    return this.noteService.buildNoteResponse(note);
  }
}

import { Controller, Get, Post, UseGuards, ParseIntPipe, Body, Param, Logger } from '@nestjs/common';
import { NoteService } from '@app/note/note.service';
import { NotesResponseInterface } from '@app/note/types/notesResponse.interface';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { User } from '@app/user/decorators/user.decorator';
import { CreateNoteDto } from '@app/note/dto/createNote.dto';
import { NoteResponseInterface } from '@app/note/types/noteResponse.interface';
import { Roles } from '@app/user/decorators/userRoles.decorator';
import { UserRole } from '@app/user/types/userRole.enum';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NoteEntity } from '@app/note/note.entity';

@Controller('notes')
@ApiTags('notes')
export class NoteController {
  private logger = new Logger('NoteController');
  constructor(private readonly noteService: NoteService) {}

  @Get()
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOkResponse({ type: [NoteEntity] })
  @UseGuards(AuthGuard)
  @Roles(UserRole.PROJECT_MANAGER)
  async findAll(): Promise<NotesResponseInterface> {
    this.logger.verbose('Retrieving all notes');
    const notes = await this.noteService.findAll();
    return { notes };
  }

  @Post(':employeeId')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiBody({
    type: CreateNoteDto,
  })
  @ApiParam({
    name: 'employeeId',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 201,
    description: 'A note for a found user has been successfuly created',
    type: NoteEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'A user with given id does not exist',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.PROJECT_MANAGER)
  async create(
    @User('id', ParseIntPipe) currentUserId: number,
    @Body('note') createNoteDto: CreateNoteDto,
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<NoteResponseInterface> {
    this.logger.verbose(`Creatin a new note for employee with id:${employeeId}. Data: ${JSON.stringify(createNoteDto)}`);
    const note = await this.noteService.createNote(currentUserId, createNoteDto, employeeId);
    return this.noteService.buildNoteResponse(note);
  }
}

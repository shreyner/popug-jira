import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, User } from '../../entities';
import { CreateTaskDto } from './dto/create-task.dto';
import { User as UserDecorator } from '../../common/user.decorator';
import { AuthenticatedGuard } from '../auth/guard/authenticated.guard';

@UseGuards(AuthenticatedGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    @Inject(TasksService)
    private readonly tasksService: TasksService,
  ) {}

  @Get()
  findAll() {
    return this.tasksService.getOpenTask();
  }

  @Post()
  create(@Body() createTask: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(createTask);
  }

  @Post('re-assign-all')
  reAssignAll(@UserDecorator() user: User) {
    return this.tasksService.reAssignAll(user);
  }

  @HttpCode(204)
  @Post('/:id/complete')
  complete(@Param('id') id: string): Promise<void> {
    return this.tasksService.complete(id);
  }
}

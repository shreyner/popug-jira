import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from '../../entities';
import { CreateTaskDto } from './dto/create-task.dto';

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

  @HttpCode(204)
  @Post('/:id/complete')
  complete(@Param('id') id: string): Promise<void> {
    return this.tasksService.complete(id);
  }
}

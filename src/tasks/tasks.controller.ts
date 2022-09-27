import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { TaskEntity } from "./entities/task.entity";
import { UsersService } from "src/users/users.service";

@Controller("tasks")
@ApiTags("Tasks")
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly usersService: UsersService
  ) {}

  @Post()
  @ApiCreatedResponse({ type: TaskEntity })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const task: any = await this.tasksService.findOne(id);
    const user = await this.usersService.findOne(task.user_id);

    if (!task) {
      throw new NotFoundException("task not found");
    }

    task.creator_user_nickname = user.nickname;
    return task;
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.tasksService.remove(+id);
  }
}

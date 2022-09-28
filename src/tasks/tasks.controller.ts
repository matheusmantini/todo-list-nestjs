import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { ApiTags } from "@nestjs/swagger";
import { UsersService } from "src/users/users.service";

@ApiTags("Task")
@Controller("task")
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly usersService: UsersService
  ) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    const task = await this.tasksService.findByTitle(createTaskDto.title);
    const user = await this.usersService.findOne(createTaskDto.creator_user_id);
    if (task?.title) {
      throw new NotFoundException("title already exists");
    }
    if (!user) {
      throw new NotFoundException("user not found");
    }
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  async findAllCreatedByUser(@Query() query: { creatorUserId: string }) {
    if (query.creatorUserId === undefined || Object.keys(query).length === 0) {
      throw new NotFoundException("parameter creatorUserId not found");
    }
    const tasks = await this.tasksService.findAllCreatedByUser(
      query.creatorUserId
    );
    if (tasks.length === 0) {
      throw new NotFoundException("task not found");
    }
    const user = await this.usersService.findOne(tasks[0].creator_user_id);
    for (let index = 0; index < tasks.length; index++) {
      tasks[index]["creator_user_nickname"] = user.nickname;
    }
    return tasks;
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const task = await this.tasksService.findOne(id);
    if (!task) {
      throw new NotFoundException("task not found");
    }
    const user = await this.usersService.findOne(task.creator_user_id);
    task["creator_user_nickname"] = user.nickname;
    return task;
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.tasksService.remove(id);
  }
}

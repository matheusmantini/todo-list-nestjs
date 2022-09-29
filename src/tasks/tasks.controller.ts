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
  BadRequestException,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { UsersService } from "src/users/users.service";
import { TaskResponsibleDto } from "./dto/task-responsible.dto";

@ApiTags("Task")
@Controller("task")
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly usersService: UsersService
  ) {}

  @Post()
  @ApiOperation({ summary: 'This endpoint creates a new task' })
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
  @ApiQuery({
    name: 'creatorUserId',
    required: true,
    type: String,
  })
  @ApiOperation({ summary: 'This endpoint returns all tasks created by a specific user' })
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
  @ApiOperation({ summary: 'This endpoint returns a task by its id' })
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
  @ApiOperation({ summary: 'This endpoint updates a task by its id' })
  update(@Param("id") id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: 'This endpoint removes a task by its id' })
  remove(@Param("id") id: string) {
    return this.tasksService.remove(id);
  }

  // Task's Responsibles

  @Get("/:taskId/responsible")
  @ApiOperation({ summary: 'This endpoint returns all users responsibles for a task' })
  async findAllUsersResponsibleForTask(@Param("taskId") taskId: string) {
    const task = await this.tasksService.findOne(taskId);
    if (!task) {
      throw new NotFoundException("task not found");
    }
    const tasksResponsibles =
      await this.tasksService.findAllUsersResponsibleForTask(taskId);

    for (let i = 0; i < tasksResponsibles.length; i++) {
      if (taskId === tasksResponsibles[i].task_id) {
        const user = await this.usersService.findOne(
          tasksResponsibles[i].responsible_id
        );
        delete tasksResponsibles[i]["id"];
        delete tasksResponsibles[i]["task_id"];
        tasksResponsibles[i]["nickname"] = user.nickname;
      }
    }

    return tasksResponsibles;
  }

  @Post("responsible")
  @ApiOperation({ summary: 'This endpoint sets an user responsible for a specific task' })
  async setUserResponsibleForTask(
    @Body() taskResponsibleDto: TaskResponsibleDto
  ) {
    const user = await this.usersService.findOne(
      taskResponsibleDto.responsible_id
    );
    const task = await this.tasksService.findOne(taskResponsibleDto.task_id);

    if (!user) {
      throw new NotFoundException("user responsible not found");
    }

    if (!task) {
      throw new NotFoundException("task not found");
    }

    const allTaskResponsibles =
      await this.tasksService.findAllTasksResponsibles();

    for (let i = 0; i < allTaskResponsibles.length; i++) {
      if (
        allTaskResponsibles[i].task_id === taskResponsibleDto.task_id &&
        allTaskResponsibles[i].responsible_id ===
          taskResponsibleDto.responsible_id
      ) {
        throw new BadRequestException(
          "user is already responsible for this task"
        );
      }
    }

    const taskResponsible = await this.tasksService.setUserResponsibleForTask(
      taskResponsibleDto
    );

    return taskResponsible;
  }
}

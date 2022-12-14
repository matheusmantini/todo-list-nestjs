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
  Put,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { UsersService } from "src/users/users.service";
import { TaskResponsibleDto } from "./dto/task-responsible.dto";
import { UpdateTaskStatusDto } from "./dto/update-task-status.dto";
import { TaskStatus } from "./status.enum";
import { UpdateMultResponsiblesTaskDto } from "./dto/update-multiple-responsible-tasks.dto";
import { TaskMultipleResponsibleDto } from "./dto/task-multiple-responsible.dto";

@ApiTags("Task")
@Controller("task")
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly usersService: UsersService
  ) {}

  @Post()
  @ApiOperation({ summary: "This endpoint creates a new task" })
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
    name: "creatorUserId",
    required: true,
    type: String,
  })
  @ApiOperation({
    summary: "This endpoint returns all tasks created by a specific user",
  })
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
  @ApiOperation({ summary: "This endpoint returns a task by its id" })
  async findOne(@Param("id") id: string) {
    const task = await this.tasksService.findOne(id);
    if (!task) {
      throw new NotFoundException("task not found");
    }
    const user = await this.usersService.findOne(task.creator_user_id);
    task["creator_user_nickname"] = user.nickname;
    return task;
  }

  @Get("all/search")
  @ApiQuery({
    name: "status",
    required: true,
    type: String,
  })
  @ApiOperation({
    summary: "This endpoint returns all tasks with a specific status",
  })
  async findAllTasksByStats(@Query() query: { status: string }) {
    if (query.status === undefined || Object.keys(query).length === 0) {
      throw new NotFoundException("parameter status not found");
    }
    return await this.tasksService.findOneStatus(query.status);
  }

  @Get("all/search/tasks")
  @ApiQuery({
    name: "search",
    required: true,
    type: String,
  })
  @ApiOperation({
    summary:
      "This endpoint returns all tasks by a specific search term included in title or description",
  })
  async findTasksBySearch(@Query() query: { search: string }) {
    if (
      query.search === undefined ||
      query.search === "" ||
      Object.keys(query).length === 0
    ) {
      throw new NotFoundException("parameter search not found");
    }
    const tasksFiltered = await this.tasksService.findTasksBySearch(
      query.search
    );
    return tasksFiltered;
  }

  @Patch(":id")
  @ApiOperation({ summary: "This endpoint updates a task by its id" })
  update(@Param("id") id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Put("/status/edit/")
  @ApiOperation({
    summary: "This endpoint updates one or multiple task's status by its id",
  })
  async updateStatusMultipleTasks(
    @Body() updateTaskStatusDto: UpdateTaskStatusDto
  ) {
    let task = {};
    for (let i = 0; i < updateTaskStatusDto.task_id.length; i++) {
      task = await this.tasksService.findOne(updateTaskStatusDto.task_id[i]);
      if (!task) {
        throw new NotFoundException(
          `task with id ${updateTaskStatusDto.task_id[i]} not found`
        );
      }

      const status = Object.values(TaskStatus);

      if (!status.includes(updateTaskStatusDto.status)) {
        throw new NotFoundException(
          "status not found. Must use: to_do, doing, done or delayed"
        );
      }

      await this.tasksService.updateStatus(
        updateTaskStatusDto.task_id[i],
        updateTaskStatusDto.status
      );
    }
  }

  @Delete(":id")
  @ApiOperation({ summary: "This endpoint removes a task by its id" })
  async removeTask(@Param("id") taskId: string) {
    const usersResponsible = await this.findAllUsersResponsibleForTask(taskId);

    for (let i = 0; i < usersResponsible.length; i++) {
      this.tasksService.deleteUsersResponsibleForTask(
        taskId,
        [usersResponsible[i].responsible_id]
      );
    }
    
    return this.tasksService.removeTask(taskId);
  }

  // Task's Responsibles

  @Get("/:taskId/responsiblesTask")
  @ApiOperation({
    summary:
      "This endpoint returns all tasks with all users responsibles for them",
  })
  async findAllTasksWithResponsibles(@Param("taskId") taskId: string) {
    const task = await this.tasksService.findOne(taskId);
    if (!task) {
      throw new NotFoundException("task not found");
    }

    const usersResponsible = await this.findAllUsersResponsibleForTask(taskId);
    task["responsible_users"] = usersResponsible;

    return task;
  }

  @Get("/:taskId/responsible")
  @ApiOperation({
    summary: "This endpoint returns all users responsibles for a task",
  })
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
  @ApiOperation({
    summary:
      "This endpoint sets one or multiple users as responsible for a specific task",
  })
  async setUsersResponsibleForTask(
    @Body() updateMultResponsiblesTask: UpdateMultResponsiblesTaskDto
  ) {
    const userResponsibles = updateMultResponsiblesTask.responsible_id;
    let user = {};
    let userId = "";

    const task = await this.tasksService.findOne(
      updateMultResponsiblesTask.task_id
    );

    if (!task) {
      throw new NotFoundException("task not found");
    }

    const tasksResponsibles =
      await this.tasksService.findAllUsersResponsibleForTask(
        updateMultResponsiblesTask.task_id
      );

    console.log("tasksResponsibles", tasksResponsibles);

    for (let i = 0; i < userResponsibles.length; i++) {
      user = await this.usersService.findOne(userResponsibles[i]);
      userId = userResponsibles[i];

      for (let i = 0; i < tasksResponsibles.length; i++) {
        if (tasksResponsibles[i].responsible_id === userId) {
          throw new BadRequestException(
            `user responsible id '${userResponsibles[i]}' is already responsible for the informed task`
          );
        }
      }

      if (!user) {
        throw new NotFoundException(
          `user responsible id '${userResponsibles[i]}' not found`
        );
      }

      await this.tasksService.setUserResponsibleForTask(
        updateMultResponsiblesTask.task_id,
        userId
      );
    }
  }

  @Delete("remove/responsible")
  @ApiOperation({
    summary: "This endpoint deletes an user responsible for a specific task",
  })
  async deleteUserResponsibleForTask(
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

    return await this.tasksService.deleteUserResponsibleForTask(
      taskResponsibleDto
    );
  }
}

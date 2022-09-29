import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskResponsibleDto } from "./dto/task-responsible.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({ data: createTaskDto });
  }

  findAll() {
    return this.prisma.task.findMany();
  }

  findAllCreatedByUser(creator_user_id: string) {
    return this.prisma.task.findMany({
      where: { creator_user_id },
    });
  }

  findOne(id: string) {
    return this.prisma.task.findUnique({ where: { id } });
  }

  findByTitle(title: string) {
    return this.prisma.task.findUnique({ where: { title } });
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: string) {
    return `This action removes a #${id} task`;
  }

  // Task's Responsibles

  findAllUsersResponsibleForTask(task_id: string) {
    return this.prisma.responsibleUserTaskRelation.findMany({
      where: {
        task_id,
      },
    });
  }

  findAllTasksResponsibles() {
    return this.prisma.responsibleUserTaskRelation.findMany();
  }

  setUserResponsibleForTask(taskResponsibleDto: TaskResponsibleDto) {
    return this.prisma.responsibleUserTaskRelation.create({
      data: taskResponsibleDto,
    });
  }
}

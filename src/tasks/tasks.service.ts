import { Injectable, NotFoundException } from "@nestjs/common";
import { Console } from "console";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskResponsibleDto } from "./dto/task-responsible.dto";
import { UpdateTaskStatusDto } from "./dto/update-task-status.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { UpdateMultResponsiblesTask } from "./entities/update-multiple-responsible-tasks.entity";

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

  findTasksBySearch(search: string) {
    return this.prisma.task.findMany({
      where: {
        OR: [
          {
            title: {
              contains: `${search}`,
            },
          },
          {
            description: {
              contains: `${search}`,
            },
          },
        ],
      },
    });
  }

  findOneStatus(status: string) {
    return this.prisma.task.findMany({ where: { status } });
  }

  findByTitle(title: string) {
    return this.prisma.task.findUnique({ where: { title } });
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  updateStatus(id: string, status: string) {
    return this.prisma.task.update({
      where: { id },
      data: { status },
    });
  }

  removeTask(id: string) {
    return this.prisma.task.delete({ where: { id } });
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

  setUserResponsibleForTask(task_id: string, responsible_id: string) {
    return this.prisma.responsibleUserTaskRelation.create({
      data: { task_id, responsible_id },
    });
  }

  async deleteUserResponsibleForTask(taskResponsibleDto: TaskResponsibleDto) {
    const responsibleUsersTasks = await this.findAllUsersResponsibleForTask(
      taskResponsibleDto.task_id
    );

    for (let i = 0; i < responsibleUsersTasks.length; i++) {
      if (
        responsibleUsersTasks[i].responsible_id ===
        taskResponsibleDto.responsible_id
      ) {
        await this.prisma.responsibleUserTaskRelation.delete({
          where: { id: responsibleUsersTasks[i].id },
        });
      } else {
        throw new NotFoundException(
          "user is not responsible for this task anymore"
        );
      }
    }
  }

  async deleteUsersResponsibleForTask(
    task_id: string,
    responsible_id: string[]
  ) {
    const responsibleUsersTasks = await this.findAllUsersResponsibleForTask(
      task_id
    );

    for (let i = 0; i < responsibleUsersTasks.length; i++) {
      for (let j = 0; j < responsible_id.length; j++) {
        if (responsibleUsersTasks[i].responsible_id === responsible_id[j]) {
          await this.prisma.responsibleUserTaskRelation.deleteMany({
            where: { id: responsibleUsersTasks[i].id },
          });
        }
      }
    }
  }
}

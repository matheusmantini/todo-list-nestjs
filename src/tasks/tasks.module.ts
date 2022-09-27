import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, UsersService],
  imports: [PrismaModule],
})
export class TasksModule {}

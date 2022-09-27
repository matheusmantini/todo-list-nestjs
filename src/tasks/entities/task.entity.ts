import { ApiProperty } from "@nestjs/swagger";
import { Task } from "@prisma/client";
import { IsOptional } from "class-validator";

export class TaskEntity implements Task {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  limit_date: Date;

  @ApiProperty()
  user_id: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateMultResponsiblesTaskDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  task_id: string;

  @IsNotEmpty()
  @ApiProperty()
  user_responsible_id: string[];
}

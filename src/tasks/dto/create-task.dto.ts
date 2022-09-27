import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsDate()	
  @ApiProperty()
  @Type(() => Date)
  limit_date: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  user_id: string;
}

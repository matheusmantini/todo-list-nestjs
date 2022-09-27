import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsString, Length, MinLength } from "class-validator";

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(20, 250)
  @ApiProperty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  limit_date: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  creator_user_id: string;
}

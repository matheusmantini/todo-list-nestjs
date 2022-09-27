import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto /* extends OmitType(CreateUserDto, ['email'] as const) */ {
  @IsString()
  @MinLength(3)
  @ApiProperty()
  @IsOptional()
  name?: string;

  @IsString()
  @MinLength(3)
  @ApiProperty()
  @IsOptional()
  nickname?: string;
}

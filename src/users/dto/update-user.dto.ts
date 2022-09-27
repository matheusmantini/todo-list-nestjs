import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends OmitType(CreateUserDto, ['email'] as const) {
  @Exclude()
  email: string;
}

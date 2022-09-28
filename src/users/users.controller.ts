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
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { Serialize } from "src/interceptors/serialize.interceptor";
import { CreateUser } from "./entities/create-user.entity";
import { AllUsers } from "./entities/all-user.entity";
import { UpdateUser } from "./entities/update-user.entity";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { Console } from "console";

@ApiTags("User")
@Controller("user")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Serialize(CreateUser)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get("all")
  @Serialize(AllUsers)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @Serialize(User)
  async findOne(@Param("id") id: string) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException("user not found");
    }

    return user;
  }

  @Get()
  @ApiQuery({
    name: 'search',
    required: true,
    type: String,
  })
  async findUserBySearch(@Query() query: { search: string }) {
    if (
      query.search === undefined ||
      query.search === "" ||
      Object.keys(query).length === 0
    ) {
      throw new NotFoundException("parameter search not found");
    }
    const usersFiltered = await this.usersService.findUsersBySearch(
      query.search
    );
    return usersFiltered;
  }

  @Patch(":id")
  @Serialize(UpdateUser)
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}

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
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Console } from "console";

@ApiTags("User")
@Controller("user")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Serialize(CreateUser)
  @ApiOperation({ summary: 'This endpoint creates a new user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get("all")
  @Serialize(AllUsers)
  @ApiOperation({ summary: 'This endpoint returns all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @Serialize(User)
  @ApiOperation({ summary: 'This endpoint returns a specific user by its id' })
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
  @ApiOperation({ summary: 'This endpoint returns all users by a specific search term' })
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
  @ApiOperation({ summary: 'This endpoint updates an user by its id' })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: 'This endpoint removes an user by its id' })
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}

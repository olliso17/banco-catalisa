import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {

    try {

      const user = await this.usersService.create(createUserDto);

      return { success: true, message: 'Successfully created' };

    } catch (error) {

      return { success: false, message: error.message };

    }

  }

  @Patch('update')
  async update(@Body() updateUserDto: UpdateUserDto) {

    try {

      const user = await this.usersService.update(updateUserDto);

      return { success: true, message: 'Successfully updated' };

    } catch (error) {

      return { success: false, message: error.message };

    }
  }

  @Patch('deactivate/:user_id')
  async deactivated(@Param('user_id') user_id: string) {

    try {

      await this.usersService.deactivated(user_id);

      return { success: false, message: 'Successfully deactivated' };

    } catch (error) {

      return { success: false, message: error.message };

    }
  }
}

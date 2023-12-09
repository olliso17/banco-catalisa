import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {

    try {

      const user = await this.usersService.update(id, updateUserDto);

      return { success: true, message: 'Successfully updated' };

    } catch (error) {

      return { success: false, message: error.message };

    }
  }

  @Patch('deactivate/:id')
  async deactivated(@Param('id') id: string) {

    try {

      await this.usersService.deactivated(id);

      return { success: false, message: 'Successfully deactivated' };

    } catch (error) {

      return { success: false, message: error.message };

    }
  }
}

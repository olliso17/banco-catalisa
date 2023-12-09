import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

const salt = "$2b$10$ilI3dCqO1g.hMFoRG09Xye"
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {

      createUserDto.cpf = bcrypt.hashSync(createUserDto.cpf, salt);
      createUserDto.password = bcrypt.hashSync(createUserDto.password, salt);

      const user = this.userRepository.create(createUserDto);
      user.active = true;

      return await this.userRepository.save(user);
    } catch (error) {

      throw new Error(error);
    }
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({
      relations: ['accounts']
    });
    return users
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneOrFail({ where: { id }, relations: ['accounts'] });
    return user;
  }

  async findByCpf(cpf: string): Promise<User> {
    cpf = bcrypt.hashSync(cpf, salt);
    const user = await this.userRepository.findOneOrFail({ where: { cpf }, relations: ['accounts'] });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['accounts'] });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (updateUserDto.active) {
      user.active = updateUserDto.active;
    }

    if (updateUserDto.password) {
      updateUserDto.password = bcrypt.hashSync(updateUserDto.password, salt);

      if (user.password === updateUserDto.password) {
        throw new Error('Password equal');
      }
      user.password = updateUserDto.password;
    }
    updateUserDto.updated_at = new Date();
    await this.userRepository.save(user);

    return user;
  }


  async remove(id: string) {
    const user = await this.findOne(id);

    if (!user) {
      throw new Error('User not found');
    }

    return this.userRepository.remove(user);
  }
}

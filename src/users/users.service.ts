import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Account } from 'src/account/entities/account.entity';
import { Historic } from 'src/historic/entities/historic.entity';
import { isCpf } from 'src/util/regext';

const salt = "$2b$10$ilI3dCqO1g.hMFoRG09Xye"
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Historic)
    private historicRepository: Repository<Historic>
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {

    try {
      if(!isCpf.test(createUserDto.cpf)){
        throw new Error("Cpf needs at least 11 numeric characters");
      }
      createUserDto.cpf = bcrypt.hashSync(createUserDto.cpf, salt);

      createUserDto.password = bcrypt.hashSync(createUserDto.password, salt);

      const user = await this.userRepository.create(createUserDto);

      const existUser = await this.userRepository.findOne({
        where: { cpf: user.cpf }
      });

      if (existUser) {
        if (existUser.active === true) {

          throw new Error('User already exists');

        }

        if (existUser.active === false) {

          await this.userRepository.save(user);

        }
      }

      if (!existUser) {

        return await this.userRepository.save(user);

      }

    } catch (error) {

      throw new Error(error);

    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {

    const user = await this.userRepository.findOneOrFail({
      where: { id, active: true }, relations: ['accounts']
    });

    if (!user) {

      throw new Error('User not found');
    }

    if (updateUserDto.active) {

      user.active = updateUserDto.active;

    }

    if (updateUserDto.password) {

      updateUserDto.password = bcrypt.hashSync(updateUserDto.password, salt);

      if (user.password === updateUserDto.password) {

        throw new Error('Same password');

      }

      user.password = updateUserDto.password;

    }

    updateUserDto.updated_at = new Date();

    await this.userRepository.save(user);

    return user;

  }

  async deactivated(id: string) {

    const user = await this.userRepository.findOneOrFail({
      where: { id }, relations: ['accounts', 'accounts.historics']
    });

    if (!user) {

      throw new Error('User not found');

    }
    if(user.active !== true){
      throw new Error('User is already deactivated');

    }
    user.active = false;

    user.deactivated_at = new Date();

    user.accounts.map(async account => {
      if (account.active === true) {
        account.active = false;

        account.deactivated_at = new Date();

        await this.accountRepository.save(account);

      }

      account.historics.map(async historic => {
        if (historic.active === true) {

          historic.active = false;

          historic.deactivated_at = new Date();
          
          await this.historicRepository.save(historic);

        }

      })

    });

    return this.userRepository.save(user);
  }


}

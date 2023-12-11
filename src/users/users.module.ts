import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Account } from 'src/account/entities/account.entity';
import { Historic } from 'src/historic/entities/historic.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([User, Account, Historic]),
    
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

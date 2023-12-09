import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { Account } from './entities/account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Historic } from 'src/historic/entities/historic.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Account, Historic, User])
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}

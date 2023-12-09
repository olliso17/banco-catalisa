import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AccountModule } from './account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Historic } from './historic/entities/historic.entity';
import { Account } from './account/entities/account.entity';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'postgres',
      entities: [User, Account, Historic], 
      synchronize: true, 
    }), 
    UsersModule, AccountModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

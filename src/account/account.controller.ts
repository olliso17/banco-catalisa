import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { DepositAccountDto } from './dto/deposit-account.dto';
import { WithdrawAccountDto } from './dto/withdraw-account';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('create')
  async create( @Body() createAccountDto: CreateAccountDto) {

    try {

      const account = await this.accountService.create(createAccountDto);

      return {success: true, data: account };

    } catch (error) {

      return { success: false, message: error.message };

    }

  }

  @Get()
  async findAll() {

    try {

      const accounts = await this.accountService.findAll();

      return {sucess: true, data: accounts};

    } catch (error) {

      return { success: false, message: error.message };

    }
    
  }
  @Get('user_id/:user_id')
  async findByUserId(@Param('user_id') user_id: string) {

    try {

      const accounts = await this.accountService.findByUserId(user_id);

      return { success: true, data: accounts };

    } catch (error) {

      return { success: false, message: error.message };

    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    try {

      const account = await this.accountService.findOne(id);

      return { success: true, data: account };

    } catch (error) {

      return { success: false, message: error.message };

    }
  }

  @Patch('deposit') 
  async deposit(@Param('id') id: string, @Body() depositAccountDto: DepositAccountDto) {

    try {

      const result = await this.accountService.deposit(depositAccountDto);

      return { success: true, data: result };

    } catch (error) {

      return { success: false, message: error.message };

    }
  }
  
  @Patch('withdraw')
  async withdraw(@Param('id') id: string, @Body() withdrawAccountDto: WithdrawAccountDto) {

    try {

      const result = await this.accountService.withdraw(withdrawAccountDto);

      return { success: true, data: result };
      
    } catch (error) {

      return { success: false, message: error.message };
    }
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.accountService.remove(id);
  // }
}

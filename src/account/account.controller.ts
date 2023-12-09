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
      return {success: true, data: account }
    } catch (error) {
      return { success: false, message: error.message };
    }
    return 
  }

  @Get()
  async findAll() {
    try {
      const accounts = await this.accountService.findAll();
      return {sucess: true, data: accounts}
    } catch (error) {
      return { success: false, message: error.message }
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

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.accountService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
  //   return 'this.accountService.update(id, updateAccountDto)';
  // }
  @Patch('deposit/:id') 
  async deposit(@Param('id') id: string, @Body() depositAccountDto: DepositAccountDto) {
    try {
      const result = await this.accountService.deposit(id, depositAccountDto);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  
  @Patch('withdraw/:id')
  async withdraw(@Param('id') id: string, @Body() withdrawAccountDto: WithdrawAccountDto) {
    try {
      const result = await this.accountService.withdraw(id, withdrawAccountDto);
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

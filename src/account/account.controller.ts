import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { DepositAccountDto } from './dto/deposit-account.dto';
import { ApiTags } from '@nestjs/swagger';
import { withdrawAccountDto } from './dto/withdraw-account.dto';

@ApiTags('accounts')
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
  @Get(':user_id')
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

  @Get('deposits/:id')
  async findByDeposit(@Param('id') account_id: string) {

    try {

      const historics_deposit = await this.accountService.findByDeposit(account_id);

      return { success: true, data: historics_deposit };

    } catch (error) {

      return { success: false, message: error.message };

    }
  }
  @Get('withdraws/:id')
  async findByWithdraw(@Param('id') account_id: string) {

    try {

      const historics_withdraw = await this.accountService.findByWithdraw(account_id);

      return { success: true, data: historics_withdraw };

    } catch (error) {

      return { success: false, message: error.message };

    }
  }

  @Patch('deposit') 
  async deposit(@Body() depositAccountDto: DepositAccountDto) {

    try {

      const result = await this.accountService.deposit(depositAccountDto);

      return { success: true, data: result };

    } catch (error) {

      return { success: false, message: error.message };

    }
  }
  
  @Patch('withdraw')
  async withdraw(@Body() withdrawAccountDto: withdrawAccountDto) {

    try {

      const result = await this.accountService.withdraw(withdrawAccountDto);

      return { success: true, data: result };
      
    } catch (error) {

      return { success: false, message: error.message };
    }
  }

  @Patch('deactivate/:account_id')
  async deactivated(@Param('account_id') account_id: string) {

    try {

      await this.accountService.deactivated(account_id);

      return { success: false, message: 'Successfully deactivated' };

    } catch (error) {

      return { success: false, message: error.message };

    }
  }
}

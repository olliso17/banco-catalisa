import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Historic } from 'src/historic/entities/historic.entity';
import { DepositAccountDto } from './dto/deposit-account.dto';
import { WithdrawAccountDto } from './dto/withdraw-account';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Historic)
    private historicRepository: Repository<Historic>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }
  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    try {
      const id = createAccountDto.user_id
      const user = await this.userRepository.findOne({where:{id}})
      if(!user){
        throw new Error('User not found')
      }

      const account = this.accountRepository.create(createAccountDto)

      if (account.type === 'Corrente') {
        account.valueType = '001'
      }
      if (account.type === 'Poupança') {
        account.valueType = '005'
      }
      await this.accountRepository.save(account)
      if(account.balance > 0){
        const historic: Historic = this.historicRepository.create({
          account_id: account.id,
          value_deposit: account.balance,
        });
        await this.historicRepository.save(historic);
      }
   
      return account
    } catch (error) {
      throw { success: false, message: error.message };
    }

  }
  async deposit(id: string, depositAccountDto: DepositAccountDto) {
    try {
      const account = await this.accountRepository.findOne({ where: { id } });
      if (!account) {
        throw new Error('Account not found');
      }
      depositAccountDto.account_id = account.id
      depositAccountDto.user_id = account.user_id
      const historic = await this.historicRepository.create(depositAccountDto)
      account.balance += historic.value_deposit;
      account.updated_at = new Date();
      await this.historicRepository.save(historic);
      return await this.accountRepository.save(account)
    } catch (error) {
      throw { success: false, message: error.message }
    }


  }

  async withdraw(id: string, withdrawAccountDto: WithdrawAccountDto) {
    try {
      const account = await this.accountRepository.findOne({ where: { id } });
      if (!account) {
        throw new Error('Account not found');
      }
      withdrawAccountDto.account_id = account.id
      withdrawAccountDto.user_id = account.user_id
      const historic = await this.historicRepository.create(withdrawAccountDto)
      account.balance -= historic.value_withdraw;
      account.updated_at = new Date();
      await this.historicRepository.save(historic);
      return await this.accountRepository.save(account)
    } catch (error) {
      throw { success: false, message: error.message }
    }
  }
  async findAll() {
    try {
      const accounts = await this.accountRepository.find({relations:['historics']})
      return accounts
    } catch (error) {
       throw new Error(error.message);
    }
  }
  async findByUserId(user_id: string) {
    try {
      const accounts = await this.accountRepository.find({where:{user_id},relations:['historics']})
      return accounts
    } catch (error) {
       throw new Error(error.message);
    }
  }

  // findOne(id: string) {
  //   return `This action returns a  account`;
  // }

  // remove(id: string) {
  //   return `This action removes a  account`;
  // }
}

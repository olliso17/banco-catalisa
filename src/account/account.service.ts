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

  async create(createAccountDto: CreateAccountDto):Promise<Account>{
    try {
      let lastAccountNumber = 0;
      const newAccountNumber = lastAccountNumber + 1;
      const paddedNumber = newAccountNumber.toString().padStart(6, '0');

      const id = createAccountDto.user_id;

      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new Error('User not found');
      }

      const account = this.accountRepository.create(createAccountDto);

      const accounts = await this.accountRepository.find({
        order: { created_at: 'DESC' },
      });
     
      if(accounts.length > 0){
        accounts.map(
          async accountCreated=>{
            if(accountCreated.id !== account.id){
              const newAccountNumber = parseFloat(accountCreated.number_account) + 1;
              const paddedNumber = newAccountNumber.toString().padStart(6, '0');
              account.number_account = `0000${paddedNumber}`.slice(-6);

              if (account.type === 'Corrente') {
                account.valueType = '001';
              }
        
              if (account.type === 'Poupança') {
                account.valueType = '005';
              }
        
              await this.accountRepository.save(account);
        
              if (account.balance > 0) {
        
                const historic: Historic = this.historicRepository.create({
                  account_id: account.id,
                  value_deposit: true,
                  ammount: account.balance,
                });
        
                await this.historicRepository.save(historic);
        
              }
        
              return account;
            }
          }
        );
      }
      if(accounts.length ===0){
        
        account.number_account = `0000${paddedNumber}`.slice(-6);

        if (account.type === 'Corrente') {
          account.valueType = '001';
        }
  
        if (account.type === 'Poupança') {
          account.valueType = '005';
        }
  
        await this.accountRepository.save(account);
  
        if (parseFloat(account.balance.toString()) > 0) {
  
          const historic: Historic = this.historicRepository.create({
            account_id: account.id,
            value_deposit: true,
            ammount: account.balance,
          });
  
          await this.historicRepository.save(historic);
  
        }
        console.log(`${account.balance}`)
  
        return account;
      }


    } catch (error) {

      throw new Error(error.message);
    }

  }

  async deposit(depositAccountDto: DepositAccountDto) {
    try {

      const account = await this.accountRepository.findOne({
        where: { id: depositAccountDto.account_id }
      });

      if (!account) {
        throw new Error('Account not found');
      }
      
      const historic = await this.historicRepository.create(depositAccountDto);
      account.balance = parseFloat(account.balance.toString());
      historic.ammount = parseFloat(historic.ammount.toString());
      account.balance += historic.ammount;

      account.updated_at = new Date();

      await this.historicRepository.save(historic);

      return await this.accountRepository.save(account);

    } catch (error) {
      throw new Error(error.message);
    }


  }

  async withdraw(withdrawAccountDto: WithdrawAccountDto) {
    try {

      const account = await this.accountRepository.findOne({ where: { id:withdrawAccountDto.account_id } });

      if (!account) {
        throw new Error('Account not found');
      }

      const historic = await this.historicRepository.create(withdrawAccountDto);
      account.balance = parseFloat(account.balance.toString());
      historic.ammount = parseFloat(historic.ammount.toString());
      if (account.balance < historic.ammount) {
        throw new Error('You have no balance');
      }

      account.balance -= historic.ammount;

      account.updated_at = new Date();

      await this.historicRepository.save(historic);

      return await this.accountRepository.save(account);

    } catch (error) {

      throw new Error(error.message);

    }
  }

  async findAll() {
    try {

      const accounts = await this.accountRepository.find({ relations: ['historics'] });

      return accounts;

    } catch (error) {

      throw new Error(error.message);

    }
  }

  async findByUserId(user_id: string) {
    try {

      const accounts = await this.accountRepository.find({ where: { user_id }, relations: ['historics'] });

      return accounts;

    } catch (error) {

      throw new Error(error.message);

    }
  }
  
  async findOne(id: string) {
    try {

      const accounts = await this.accountRepository.findOne({ where: { id }, relations: ['historics'] });

      return accounts;

    } catch (error) {

      throw new Error(error.message);

    }
  }
  async findByDeposit(id: string) {
    try {

      const historics = await this.historicRepository.find({ where: { account_id:id, value_deposit:true}, relations: ['historics'] });

      return historics;

    } catch (error) {

      throw new Error(error.message);

    }
  }

  // remove(id: string) {
  //   return `This action removes a  account`;
  // }
}

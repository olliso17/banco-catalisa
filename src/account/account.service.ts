import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Historic } from 'src/historic/entities/historic.entity';
import { DepositAccountDto } from './dto/deposit-account.dto';
import { User } from 'src/users/entities/user.entity';
import { withdrawAccountDto } from './dto/withdraw-account.dto';

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

      if (accounts.length > 0) {
        accounts.map(
          async accountCreated => {
            if (accountCreated.id !== account.id) {
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

      return account;

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

  async withdraw(withdrawAccountDto: withdrawAccountDto) {
    try {

      const account = await this.accountRepository.findOne({ where: { id: withdrawAccountDto.account_id } });

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
  async findByDeposit(account_id: string) {
    try {

      const historics = await this.historicRepository.find({
        where: { account_id: account_id, value_deposit: true }
      });

      return historics;

    } catch (error) {

      throw new Error(error.message);

    }
  }
  async findByWithdraw(account_id: string) {
    try {

      const historics = await this.historicRepository.find({
        where: { account_id: account_id, value_withdraw: true }
      });

      return historics;

    } catch (error) {

      throw new Error(error.message);

    }
  }

  async deactivated(id: string) {
    try {
      const account = await this.accountRepository.findOneOrFail({
        where: { id }, relations: ['historics']
      });

      if (!account) {

        throw new NotFoundException('Account not found');

      }

      if (account.active === false) {
        throw new NotFoundException('Account is already deactivated');

      }
      account.active = false;

      account.deactivated_at = new Date();



      account.historics.map(async historic => {
        if (historic.active === true) {

          historic.active = false;

          historic.deactivated_at = new Date();

          await this.historicRepository.save(historic);

        }

      });

      return this.accountRepository.save(account);
    } catch (error) {

      throw new NotFoundException(error);

    }
  }
}

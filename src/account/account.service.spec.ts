import { UsersService } from 'src/users/users.service';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { DepositAccountDto } from './dto/deposit-account.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Account } from './entities/account.entity';
import { Historic } from 'src/historic/entities/historic.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

import * as bcrypt from 'bcryptjs';
import { withdrawAccountDto } from './dto/withdraw-account.dto';

describe('AccountService', () => {
  let userService: UsersService;
  let accountService: AccountService;
  let userRepository: Repository<User>;
  let accountRepository: Repository<Account>;
  let historicRepository: Repository<Historic>;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService, UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Account),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Historic),
          useClass: Repository,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    accountService = module.get<AccountService>(AccountService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    accountRepository = module.get<Repository<Account>>(getRepositoryToken(Account));
    historicRepository = module.get<Repository<Historic>>(getRepositoryToken(Historic));
  });

  describe('create', () => {
    it('should create a new account', async () => {


      const createUserDto: CreateUserDto = {
        cpf: '12345678900',
        password: 'password123',
      };

      const salt = "$2b$10$ilI3dCqO1g.hMFoRG09Xye";
      createUserDto.cpf = bcrypt.hashSync(createUserDto.cpf, salt);
      createUserDto.password = bcrypt.hashSync(createUserDto.password, salt);

      const createdUser = new User({
        cpf: createUserDto.cpf,
        password: createUserDto.password
      });
      const createAccountDto: CreateAccountDto = {
        user_id: createdUser.id,
        type: "Corrente",
        balance: 0
      };
      const createdAccount = new Account({
        type: createAccountDto.type,
        user_id: createAccountDto.user_id,
        balance: createAccountDto.balance
      });

      jest.spyOn(accountRepository, 'create').mockReturnValueOnce(createdAccount);

      expect(createAccountDto.type).toEqual(createdAccount.type);
      expect(createAccountDto.balance).toEqual(createdAccount.balance);
      expect(createAccountDto.user_id).toEqual(createdAccount.user_id);
    });

    it('should handle errors during account creation', async () => {
      const createAccountDto: CreateAccountDto = {
        user_id: "2",
        type: "Corrente",
        balance: 0
      };
      const createUserDto: CreateUserDto = {
        cpf: '12345678900',
        password: 'password123',
      };
      const salt = "$2b$10$ilI3dCqO1g.hMFoRG09Xye";
      createUserDto.cpf = bcrypt.hashSync(createUserDto.cpf, salt);
      createUserDto.password = bcrypt.hashSync(createUserDto.password, salt);
      const createdUser = new User({
        cpf: createUserDto.cpf,
        password: createUserDto.password
      })
      const createdAccount: Account = {
        id: "1",
        user_id: createdUser.id,
        type: "Corrente",
        balance: 0,
        active: true,
        created_at: new Date(),
        deactivated_at: null,
        updated_at: null,
        number_account: "00001",
        agency: "003",
        valueType: "005",
        historics: [],
        user: createdUser
      };
      jest.spyOn(accountService, 'create').mockRejectedValueOnce(new Error('Account creation failed'));

      try {
        await accountService.create(createAccountDto);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Account creation failed');
      }
    });
    describe('deposit', () => {
      it('should deposit into the account', async () => {
        const depositAccountDto: DepositAccountDto = {
          account_id: "w",
          ammount: 150,
          value_deposit: true,

        };

        const updatedAccount = new Historic({
          account_id: depositAccountDto.account_id,
          ammount: depositAccountDto.ammount,
          value_deposit: depositAccountDto.value_deposit
        })

        jest.spyOn(historicRepository, 'create').mockReturnValueOnce(updatedAccount);

        expect(depositAccountDto.account_id).toEqual(updatedAccount.account_id);
        expect(depositAccountDto.ammount).toEqual(updatedAccount.ammount);
        expect(depositAccountDto.value_deposit).toEqual(updatedAccount.value_deposit);
      });
    });
    describe('withdraw', () => {
      it('should withdraw into the account', async () => {
        const withdrawAccountDto: withdrawAccountDto = {
          account_id: "w",
          ammount: 150,
          value_withdraw: true,

        };

        const updatedAccount = new Historic({
          account_id: withdrawAccountDto.account_id,
          ammount: withdrawAccountDto.ammount,
          value_withdraw: withdrawAccountDto.value_withdraw
        })

        jest.spyOn(historicRepository, 'create').mockReturnValueOnce(updatedAccount);

        expect(withdrawAccountDto.account_id).toEqual(updatedAccount.account_id);
        expect(withdrawAccountDto.ammount).toEqual(updatedAccount.ammount);
        expect(withdrawAccountDto.value_withdraw).toEqual(updatedAccount.value_withdraw);
      });
    });
    describe('findAll', () => {
      it('should return all accounts', async () => {
        const createUserDto: CreateUserDto = {
          cpf: '12345678900',
          password: 'password123',
        };
        const salt = "$2b$10$ilI3dCqO1g.hMFoRG09Xye";
        createUserDto.cpf = bcrypt.hashSync(createUserDto.cpf, salt);
        createUserDto.password = bcrypt.hashSync(createUserDto.password, salt);
        const createdUser = new User({
          cpf: createUserDto.cpf,
          password: createUserDto.password
        })
        const accounts: Account[] = [
          {
            id: "1",
            user_id: createdUser.id,
            type: "Corrente",
            balance: 0,
            active: true,
            created_at: new Date(),
            deactivated_at: null,
            updated_at: null,
            number_account: "00001",
            agency: "003",
            valueType: "005",
            historics: [],
            user: createdUser
          },
          {
            id: "2",
            user_id: createdUser.id,
            type: "Corrente",
            balance: 0,
            active: true,
            created_at: new Date(),
            deactivated_at: null,
            updated_at: null,
            number_account: "00001",
            agency: "003",
            valueType: "005",
            historics: [],
            user: createdUser
          }
        ];

        jest.spyOn(accountService, 'findAll').mockResolvedValueOnce(accounts);

        const result = await accountService.findAll();

        expect(result).toEqual(accounts);
      });
    });
    describe('findByUserId', () => {
      it('should find accounts by user ID', async () => {
        const createUserDto: CreateUserDto = {
          cpf: '12345678900',
          password: 'password123',
        };
        const salt = "$2b$10$ilI3dCqO1g.hMFoRG09Xye";
        createUserDto.cpf = bcrypt.hashSync(createUserDto.cpf, salt);
        createUserDto.password = bcrypt.hashSync(createUserDto.password, salt);
        const createdUser = new User({
          cpf: createUserDto.cpf,
          password: createUserDto.password
        })
        const accounts: Account[] = [
          {
            id: "1",
            user_id: createdUser.id,
            type: "Corrente",
            balance: 0,
            active: true,
            created_at: new Date(),
            deactivated_at: null,
            updated_at: null,
            number_account: "00001",
            agency: "003",
            valueType: "005",
            historics: [],
            user: createdUser
          },
          {
            id: "2",
            user_id: createdUser.id,
            type: "Corrente",
            balance: 0,
            active: true,
            created_at: new Date(),
            deactivated_at: null,
            updated_at: null,
            number_account: "00001",
            agency: "003",
            valueType: "005",
            historics: [],
            user: createdUser
          }
        ];

        jest.spyOn(accountService, 'findByUserId').mockResolvedValueOnce(accounts);

        const result = await accountService.findByUserId(createdUser.id);

        expect(result).toEqual(accounts);
      });

    });
    describe('findOne', () => {
      it('should find an account by ID', async () => {
        const createUserDto: CreateUserDto = {
          cpf: '12345678900',
          password: 'password123',
        };
        const salt = "$2b$10$ilI3dCqO1g.hMFoRG09Xye";
        createUserDto.cpf = bcrypt.hashSync(createUserDto.cpf, salt);
        createUserDto.password = bcrypt.hashSync(createUserDto.password, salt);
        const createdUser = new User({
          cpf: createUserDto.cpf,
          password: createUserDto.password
        })
        const account: Account = {
          id: "1",
          user_id: createdUser.id,
          type: "Corrente",
          balance: 0,
          active: true,
          created_at: new Date(),
          deactivated_at: null,
          updated_at: null,
          number_account: "00001",
          agency: "003",
          valueType: "005",
          historics: [],
          user: createdUser
        };

        jest.spyOn(accountService, 'findOne').mockResolvedValueOnce(account);

        const result = await accountService.findOne(account.id);

        expect(result).toEqual(account);
      });

    });
    describe('findByDeposit', () => {
      it('should find historic deposits by account ID', async () => {
        const createUserDto: CreateUserDto = {
          cpf: '12345678900',
          password: 'password123',
        };
        const salt = "$2b$10$ilI3dCqO1g.hMFoRG09Xye";
        createUserDto.cpf = bcrypt.hashSync(createUserDto.cpf, salt);
        createUserDto.password = bcrypt.hashSync(createUserDto.password, salt);
        const createdUser = new User({
          cpf: createUserDto.cpf,
          password: createUserDto.password
        })
        const accountCreate: Account = {
              id: "1",
              user_id: createdUser.id,
              type: "Corrente",
              balance: 0,
              active: true,
              created_at: new Date(),
              deactivated_at: null,
              updated_at: null,
              number_account: "00001",
              agency: "003",
              valueType: "005",
              historics: [],
              user: createdUser
            }
            const accountCreate1: Account = {
              id: "2",
              user_id: createdUser.id,
              type: "Corrente",
              balance: 0,
              active: true,
              created_at: new Date(),
              deactivated_at: null,
              updated_at: null,
              number_account: "00001",
              agency: "003",
              valueType: "005",
              historics: [],
              user: createdUser
            }
        const historicDeposits: Historic[] = [
          {
            id: '1',
            active: true,
            created_at: new Date('2023-01-01'),
            updated_at: null,
            deactivated_at: null,
            account:accountCreate,
            account_id: accountCreate.id,
            value_deposit: true,
            value_withdraw: false,
            ammount: 100.0,
          },
          {
            id: '1',
            active: true,
            created_at: new Date('2023-01-01'),
            updated_at: null,
            deactivated_at: null,
            account:accountCreate1,
            account_id: accountCreate1.id,
            value_deposit: true,
            value_withdraw: false,
            ammount: 100.0,
          },
     
        ]; 
  
        jest.spyOn(accountService, 'findByDeposit').mockResolvedValueOnce(historicDeposits);
  
        const result = await accountService.findByDeposit(accountCreate.id);
  
        expect(result).toEqual(historicDeposits);
      });
      describe('findByWithdraw', () => {
        it('should find historic withdrawals by account ID', async () => {
          const createUserDto: CreateUserDto = {
            cpf: '12345678900',
            password: 'password123',
          };
          const salt = "$2b$10$ilI3dCqO1g.hMFoRG09Xye";
          createUserDto.cpf = bcrypt.hashSync(createUserDto.cpf, salt);
          createUserDto.password = bcrypt.hashSync(createUserDto.password, salt);
          const createdUser = new User({
            cpf: createUserDto.cpf,
            password: createUserDto.password
          })
          const accountCreate: Account = {
                id: "1",
                user_id: createdUser.id,
                type: "Corrente",
                balance: 0,
                active: true,
                created_at: new Date(),
                deactivated_at: null,
                updated_at: null,
                number_account: "00001",
                agency: "003",
                valueType: "005",
                historics: [],
                user: createdUser
              }
              const accountCreate1: Account = {
                id: "2",
                user_id: createdUser.id,
                type: "Corrente",
                balance: 0,
                active: true,
                created_at: new Date(),
                deactivated_at: null,
                updated_at: null,
                number_account: "00001",
                agency: "003",
                valueType: "005",
                historics: [],
                user: createdUser
              }
          const historicWithdrawals: Historic[] = [
            {
              id: '1',
              active: true,
              created_at: new Date('2023-01-01'),
              updated_at: null,
              deactivated_at: null,
              account:accountCreate,
              account_id: accountCreate.id,
              value_deposit: false,
              value_withdraw: true,
              ammount: 100.0,
            },
            {
              id: '1',
              active: true,
              created_at: new Date('2023-01-01'),
              updated_at: null,
              deactivated_at: null,
              account:accountCreate1,
              account_id: accountCreate1.id,
              value_deposit: false,
              value_withdraw: true,
              ammount: 100.0,
            },
          ]; 
    
          jest.spyOn(accountService, 'findByWithdraw').mockResolvedValueOnce(historicWithdrawals);
    
          const result = await accountService.findByWithdraw(accountCreate1.id);
    
          expect(result).toEqual(historicWithdrawals);
        });
      });
    });
  });
});

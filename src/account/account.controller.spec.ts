import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Account } from './entities/account.entity';
import { Historic } from 'src/historic/entities/historic.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { DepositAccountDto } from './dto/deposit-account.dto';
import { withdrawAccountDto } from './dto/withdraw-account.dto';

describe('AccountController', () => {
  let accountController: AccountController;
  let accountService: AccountService;
  let userRepository: Repository<User>;
  let accountRepository: Repository<Account>;
  let historicRepository: Repository<Historic>;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [AccountService,
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
          },],
    }).compile();

    accountController = module.get<AccountController>(AccountController);
    accountService = module.get<AccountService>(AccountService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    accountRepository = module.get<Repository<Account>>(getRepositoryToken(Account));
    historicRepository = module.get<Repository<Historic>>(getRepositoryToken(Historic));
  });

  describe('create', () => {
    it('should create a new account', async () => {
        
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
      jest.spyOn(accountService, 'create').mockResolvedValue(createdAccount);

      const result = await accountController.create(createdAccount);
      expect(result).toEqual({ success: true, data: createdAccount });
    });
    describe('findByUserId', () => {
        it('should return accounts by user id', async () => {
          const mockUserId = '123'; // Replace with a valid user id
          const mockAccounts = [
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
              }
          ];
    
          jest.spyOn(accountService, 'findByUserId').mockResolvedValue(mockAccounts);
    
          const result = await accountController.findByUserId(mockUserId);
          expect(result).toEqual({ success: true, data: mockAccounts });
        });
        describe('findOne', () => {
            it('should return an account by ID', async () => {
              const mockAccountId = 'abc'; // Replace with a valid account ID
              const mockAccount = {
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
        
              jest.spyOn(accountService, 'findOne').mockResolvedValue(mockAccount);
        
              const result = await accountController.findOne(mockAccountId);
              expect(result).toEqual({ success: true, data: mockAccount });
            });
          });
        //   describe('findAll', () => {
        //     it('should return all accounts', async () => {
        //       const mockAccounts = [
        //         {
        //             id: "1",
        //             user_id: createdUser.id,
        //             type: "Corrente",
        //             balance: 0,
        //             active: true,
        //             created_at: new Date(),
        //             deactivated_at: null,
        //             updated_at: null,
        //             number_account: "00001",
        //             agency: "003",
        //             valueType: "005",
        //             historics: [],
        //             user: createdUser
        //           }
        //       ];
        
        //       jest.spyOn(accountService, 'findAll').mockResolvedValue(mockAccounts);
        
        //       const result = await accountController.findAll();
        //       expect(result).toEqual({ success: true, data: mockAccounts });
        //     });
        //   });
        describe('findByDeposit', () => {
            it('should return historic deposits by account ID', async () => {
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
              const mockHistoricDeposits = [
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
        
              jest.spyOn(accountService, 'findByDeposit').mockResolvedValue(mockHistoricDeposits);
        
              const result = await accountController.findByDeposit(accountCreate1.id);
              expect(result).toEqual({ success: true, data: mockHistoricDeposits });
            });
          });
          describe('findByWithdraw', () => {
            it('should return historic withdraw by account ID', async () => {
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
              const mockHistoricWithdraw = [
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
        
              jest.spyOn(accountService, 'findByDeposit').mockResolvedValue(mockHistoricWithdraw);
        
              const result = await accountController.findByDeposit(accountCreate1.id);
              expect(result).toEqual({ success: true, data: mockHistoricWithdraw });
            });
          });
          describe('deposit', () => {
            it('should deposit amount into account', async () => {
              const depositDto: DepositAccountDto = {
                account_id:"2",
                ammount:100,
                value_deposit:true

              };
        
              const expectedResult = {
                id: "1",
                user_id: createdUser.id,
                type: "Corrente",
                balance: 0 +100,
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
        
              jest.spyOn(accountService, 'deposit').mockResolvedValue(expectedResult);
        
              const result = await accountController.deposit(depositDto);
              expect(result).toEqual({ success: true, data: expectedResult });
            });
        
            it('should handle deposit error', async () => {
              const depositDto: DepositAccountDto = {
                account_id:"",
                ammount:100,
                value_deposit: true
              };
        
              const errorMessage = 'Deposit error message';
              jest.spyOn(accountService, 'deposit').mockRejectedValue(new Error(errorMessage));
        
              const result = await accountController.deposit(depositDto);
              expect(result).toEqual({ success: false, message: errorMessage });
            });
          });
          describe('withdraw', () => {
            it('should withdraw amount into account', async () => {
              const withdrawDto: withdrawAccountDto = {
                account_id:"2",
                ammount:100,
                value_withdraw:true

              };
        
              const expectedResult = {
                id: "1",
                user_id: createdUser.id,
                type: "Corrente",
                balance: 200-100,
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
              
              jest.spyOn(accountService, 'withdraw').mockResolvedValue(expectedResult);
        
              const result = await accountController.withdraw(withdrawDto);
              expect(result).toEqual({ success: true, data: expectedResult });
            });
        
            it('should handle withdraw error', async () => {
              const withdrawDto: withdrawAccountDto = {
                account_id:"",
                ammount:100,
                value_withdraw: true
              };
        
              const errorMessage = 'withdraw error message';
              jest.spyOn(accountService, 'withdraw').mockRejectedValue(new Error(errorMessage));
        
              const result = await accountController.withdraw(withdrawDto);
              expect(result).toEqual({ success: false, message: errorMessage });
            });
          });
      });
  });
});

  
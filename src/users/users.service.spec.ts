import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Account } from 'src/account/entities/account.entity';
import { Historic } from 'src/historic/entities/historic.entity';
import * as bcrypt from 'bcryptjs';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let accountRepository: Repository<Account>;
  let historicRepository: Repository<Historic>;

  const mockUserRepository = {
    create: jest.fn(),
    findOne: jest.fn(),
    findOneOrFail: jest.fn(),
    save: jest.fn(),
  };

  const mockAccountRepository = {
    save: jest.fn(),
  };

  const mockHistoricRepository = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Account),
          useValue: mockAccountRepository,
        },
        {
          provide: getRepositoryToken(Historic),
          useValue: mockHistoricRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    accountRepository = module.get<Repository<Account>>(getRepositoryToken(Account));
    historicRepository = module.get<Repository<Historic>>(getRepositoryToken(Historic));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        cpf:"021",
        password: "akdhkahsdka",
      };

      mockUserRepository.create.mockReturnValue(createUserDto);
      mockUserRepository.save.mockReturnValue(createUserDto);

      const result = await service.create(createUserDto);

      expect(result).toEqual(createUserDto);
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { cpf: createUserDto.cpf } });
      expect(mockUserRepository.save).toHaveBeenCalledWith(createUserDto);
    });

  });

  describe('update', () => {
    it('should update user information', async () => {
      const id = 'sampleId';
      const updateUserDto: UpdateUserDto = {
        updated_at: new Date()
      };

      const user = new User({
          cpf:"ahahsdhaoshdao",
          password: "akdhkahsdka",
      });

      mockUserRepository.findOneOrFail.mockReturnValue(user);

      const result = await service.update(id, updateUserDto);
    });
  });

  describe('deactivated', () => {
    it('should deactivate a user and associated accounts/historics', async () => {
      const id = 'sampleId';

      const user = new User({
          cpf:"ahahsdhaoshdao",
          password: "akdhkahsdka"
      });
      user.active = true;
      user.accounts = [
        // Define sample accounts
      ];
      mockUserRepository.findOneOrFail.mockReturnValue(user);
      mockAccountRepository.save.mockResolvedValue(null);
      mockHistoricRepository.save.mockResolvedValue(null);

      const result = await service.deactivated(id);
    });

  });
});

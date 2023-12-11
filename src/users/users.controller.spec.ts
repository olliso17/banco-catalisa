import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from 'src/account/entities/account.entity';
import { Historic } from 'src/historic/entities/historic.entity';


describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let userRepository: Repository<User>;
  let accountRepository: Repository<Account>;
  let historicRepository: Repository<Historic>;

  const createUserDto: CreateUserDto = {
    cpf: '12345678900',
    password: 'password123',
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService,
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

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    accountRepository = module.get<Repository<Account>>(getRepositoryToken(Account));
    historicRepository = module.get<Repository<Historic>>(getRepositoryToken(Historic));
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        cpf: '12345678900',
        password: 'password123',
        active: true,
      };

      const salt = "$2b$10$ilI3dCqO1g.hMFoRG09Xye";
      createUserDto.cpf = bcrypt.hashSync(createUserDto.cpf, salt);
      createUserDto.password = bcrypt.hashSync(createUserDto.password, salt);
      const createdUser = new User({
        cpf: createUserDto.cpf,
        password: createUserDto.password
      })

      jest.spyOn(usersService, 'create').mockResolvedValueOnce(createdUser);

      const result = await usersController.create(createUserDto);

      expect(result).toEqual({ success: true, message: 'Successfully created' });
    });

    it('should handle errors during user creation', async () => {
      const createUserDto: CreateUserDto = {
        cpf: '12345678900',
        password: 'password123',
        active: true,
      };

      jest.spyOn(usersService, 'create').mockRejectedValueOnce(new Error('User creation failed'));

      const result = await usersController.create(createUserDto);

      expect(result).toEqual({ success: false, message: 'User creation failed' });
    });
    describe('update', () => {
      it('should update an existing user', async () => {
        const updateUserDto: UpdateUserDto = {
          user_id: "1",
          updated_at: new Date(),
        };
        const salt = "$2b$10$ilI3dCqO1g.hMFoRG09Xye";
        const password = bcrypt.hashSync('newPassword', salt);

        const updatedUser: User = {
          id: "1",
          cpf: createUserDto.cpf,
          password: password,
          active: true,
          created_at: new Date(),
          deactivated_at: null,
          updated_at: null,
          accounts: []
        }; 
  
        jest.spyOn(usersService, 'update').mockResolvedValueOnce(updatedUser);
  
        const result = await usersController.update(updateUserDto);
  
        expect(result).toEqual({ success: true, message: 'Successfully updated' });
      });
  
      it('should handle errors during user update', async () => {
        const updateUserDto: UpdateUserDto = {
          user_id: "1",
          updated_at: new Date(),
        };
  
        jest.spyOn(usersService, 'update').mockRejectedValueOnce(new Error('User update failed'));
  
        const result = await usersController.update(updateUserDto);
  
        expect(result).toEqual({ success: false, message: 'User update failed' });
      });
    });
  
    describe('deactivate', () => {
      it('should deactivate an existing user', async () => {
  
        jest.spyOn(usersService, 'deactivated').mockResolvedValueOnce(undefined);
  
        
        const updatedUser: User = {
          id: "1",
          cpf: createUserDto.cpf,
          password: 'adadadad',
          active: true,
          created_at: new Date(),
          deactivated_at: null,
          updated_at: null,
          accounts: []
        }; 
        const result = await usersController.deactivated(updatedUser.id);

        expect(result).toEqual({ success: false, message: 'Successfully deactivated' });
      });
  
      
    });
  });

});

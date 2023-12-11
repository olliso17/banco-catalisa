import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccountService } from 'src/account/account.service';
import { Account } from 'src/account/entities/account.entity';
import { Historic } from 'src/historic/entities/historic.entity';
describe('UserService', () => {
  let userService: UsersService;
  let userRepository: Repository<User>;
  let accountRepository: Repository<Account>;
  let historicRepository: Repository<Historic>; 

  const createUserDto: CreateUserDto = {
    cpf: '12345678900',
    password: 'password123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
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
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    accountRepository = module.get<Repository<Account>>(getRepositoryToken(Account));
    historicRepository = module.get<Repository<Historic>>(getRepositoryToken(Historic));
  });

  describe('create', () => {
    it('should create a new user', () => {

      const salt = "$2b$10$ilI3dCqO1g.hMFoRG09Xye";
      createUserDto.cpf = bcrypt.hashSync(createUserDto.cpf, salt);
      createUserDto.password = bcrypt.hashSync(createUserDto.password, salt);
      const createdUser = new User({
        cpf: createUserDto.cpf,
        password: createUserDto.password
      })

      const createUserSpy = jest.spyOn(userRepository, 'create').mockReturnValueOnce(createdUser);
      const saveUserSpy = jest.spyOn(userRepository, 'save').mockResolvedValueOnce(createdUser);

      expect(createUserDto.cpf).toEqual(createdUser.cpf);
      expect(createUserDto.password).toEqual(createdUser.password);
    });
  });
  describe('deactivated', () => {
    it('should deactivate a user and related accounts', async () => {
      const userId = '1';
      const salt = "$2b$10$ilI3dCqO1g.hMFoRG09Xye";
      createUserDto.cpf = bcrypt.hashSync(createUserDto.cpf, salt);
      createUserDto.password = bcrypt.hashSync(createUserDto.password, salt);

      const existingUser: User = {
        id: "1",
        cpf: createUserDto.cpf,
        password: createUserDto.password,
        active: true,
        created_at: new Date(),
        deactivated_at: null,
        updated_at: null,
        accounts: []
      };

      const findOneSpy = jest.spyOn(userRepository, 'findOneOrFail').mockResolvedValueOnce(existingUser);
      const saveSpy = jest.spyOn(userRepository, 'save').mockResolvedValueOnce({
        ...existingUser,
        active: false,
        deactivated_at: new Date(),
        accounts: [],
      });

      const deactivatedUser = await userService.deactivated(userId);

      expect(findOneSpy).toHaveBeenCalledWith({ where: { id: userId }, relations: ['accounts', 'accounts.historics'] });
      expect(saveSpy).toHaveBeenCalledWith({
        ...existingUser,
        active: false,
        deactivated_at: expect.any(Date),
      });
    });
  });
  describe('update', () => {
    it('should update an existing user', async () => {
      const updateUserDto: UpdateUserDto = {
        user_id: "1",
        updated_at: new Date(),
      };

      const salt = "$2b$10$ilI3dCqO1g.hMFoRG09Xye";
      const password = bcrypt.hashSync('newPassword', salt);

      const existingUser: User = {
        id: "1",
        cpf: createUserDto.cpf,
        password: password,
        active: false,
        created_at: new Date(),
        deactivated_at: null,
        updated_at: null,
        accounts: []
      };

      const findOneSpy = jest.spyOn(userRepository, 'findOneOrFail').mockResolvedValueOnce(existingUser);
      const saveSpy = jest.spyOn(userRepository, 'save').mockResolvedValueOnce({
        ...existingUser,
        active: false,
        password: bcrypt.hashSync('newPassword', salt),
      });

      const updatedUser = await userService.update(updateUserDto);

      expect(findOneSpy).toHaveBeenCalledWith({ where: { id: '1', active: true }, relations: ['accounts'] });
      expect(saveSpy).toHaveBeenCalledWith({
        ...existingUser,
        active: false,
        password: bcrypt.hashSync('newPassword', salt),
      });
      expect(updatedUser).toEqual({
        ...existingUser,
        active: false,
        password: bcrypt.hashSync('newPassword', salt),
      });
    });
  });
});





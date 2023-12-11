import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello, I would like to present my project for the developer position challenge at Catalisa.I am very excited about carrying out this little project."', () => {
      expect(appController.getHello()).toBe('Hello, I would like to present my project for the developer position challenge at Catalisa.I am very excited about carrying out this little project.');
    });
  });
});

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello, I would like to present my project for the developer position challenge at Catalisa.I am very excited about carrying out this little project.';
  }
}

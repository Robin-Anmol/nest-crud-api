import { Controller, Get, Inject, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

// controllers ony bussy for handling request
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  SignUp(@Req() req: Request) {
    console.log(req);
  }

  @Get('login')
  SignIn() {
    return this.authService.login();
  }
}

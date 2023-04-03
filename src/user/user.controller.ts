import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/auth/Guard';
import { GetUser } from 'src/auth/decorator';
@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  @Get('me')
  async getProfile(@GetUser() user: User) {
    return user;
  }
}

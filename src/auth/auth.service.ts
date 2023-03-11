import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
// service is responsnible for bussiness logic
@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  login() {
    return { msg: 'user logged in ' };
  }
}

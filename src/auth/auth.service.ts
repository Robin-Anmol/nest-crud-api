import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ConfigService } from '@nestjs/config';
// service is responsnible for bussiness logic
@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signUp(signUpDto: AuthDto) {
    const isUserExist = await this.prisma.user.findUnique({
      where: {
        email: signUpDto.email,
      },
    });
    if (isUserExist) {
      throw new ForbiddenException('Credential already taken');
    }

    try {
      const hash = await argon.hash(signUpDto.password);
      const user = await this.prisma.user.create({
        data: {
          email: signUpDto.email,
          password: hash,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          firstName: true,
          lastName: true,
        },
      });
      return this.signToken(user.id, user.email);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Credential Taken');
        }
      }
    }
  }

  async login(dto: AuthDto) {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if user does not exist throw exception
    if (!user) {
      throw new ForbiddenException('Credential Incorrect ');
    }

    //compare  password
    const passMatch = await argon.verify(user.password, dto.password);
    //  if password is incorrect throw exception
    if (!passMatch) {
      throw new ForbiddenException('Credential Incorrect ');
    }

    delete user.password;
    // if credential are correct then send back the user
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const SECRET = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: SECRET,
    });
    return {
      access_token: token,
    };
  }
}

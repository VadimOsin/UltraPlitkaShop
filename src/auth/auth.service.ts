import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthDto } from './auth.dto';
import { faker } from '@faker-js/faker';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {
  }

  async register(dto: AuthDto) {
    const oldUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (oldUser) throw new BadRequestException('Пользователь уже существует');

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: faker.name.firstName(),
        avatarPath: faker.image.avatar(),
        phone: faker.phone.number('+375 (##) ###-##-##'),
        password: await hash(dto.password),
      },
    });
    const tokens = await this.issueTokens(user.id);
    return {
      user: this.returnUserField(user),
      ...tokens,
    };
  }

  async getNewToken(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException('Войдите снова');
    const user = await this.prisma.user.findUnique({
      where: {
        id: result.id,
      },
    });
    const tokens = await this.issueTokens(user.id);
    return {
      user: this.returnUserField(user),
      ...tokens,
    };
  }

  async login(dto: AuthDto) {
    const user = await this.vaildateUser(dto);
    const tokens = await this.issueTokens(user.id);
    return {
      user: this.returnUserField(user),
      ...tokens,
    };
  }

  private async issueTokens(userId: number) {
    const data = { id: userId };
    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });
    const refreshToken = this.jwt.sign(data, {
      expiresIn: '3d',
    });
    return { accessToken, refreshToken };
  }

  private returnUserField(user: User) {
    return {
      id: user.id,
      email: user.email,
    };
  }

  private async vaildateUser(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new NotFoundException('Пользователь не найден');
    const isVaild = await verify(user.password, dto.password);
    if (!isVaild) throw new UnauthorizedException('Пароли не совпадают');
    return user;
  }
}
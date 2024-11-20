import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { SignInDto } from './dto/signIn.dto';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  getTokens(id: number) {
    const payload = { id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });
    return { accessToken, refreshToken };
  }

  signUp(signUpDto: CreateUserDto): Promise<User> {
    return this.userService.create(signUpDto);
  }

  async signIn(
    signInDto: SignInDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { accessToken: kakaoAccessToken } = signInDto;
    const userInfo = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${kakaoAccessToken}` },
    });
    const { id, properties } = userInfo.data;
    const { nickname, thumbnail_image } = properties;

    let user = await this.userService.findUserByKakaoId(id);
    if (!user) {
      user = await this.signUp({
        kakaoId: `${id}`,
        name: nickname,
        profileImage: thumbnail_image,
      });
    }

    const { accessToken, refreshToken } = this.getTokens(user.id);
    return { accessToken, refreshToken };
  }
}

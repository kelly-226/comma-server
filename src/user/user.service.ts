import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create.dto';

import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async findUserByKakaoId(kakaoId: string): Promise<User | null> {
    return this.userRepository.findOneBy({ kakaoId });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.kakaoId = createUserDto.kakaoId;
    user.name = createUserDto.name;
    user.profileImage = createUserDto.profileImage;
    return this.userRepository.save(user);
  }
}

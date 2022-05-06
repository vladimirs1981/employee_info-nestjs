import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { UpdateUserDto } from '@app/user/dto/updateUser.dto';
import { UserRole } from '@app/user/types/userRole.enum';
import { UserSeniority } from './types/userSeniority.enum';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      email: createUserDto.email,
    });
    if (userByEmail) {
      throw new HttpException('Email is taken', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  async findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findById(userId);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async updateUserRole(currentUserId: number, role: UserRole): Promise<UserEntity> {
    const user = await this.findById(currentUserId);
    user.role = role;
    await this.userRepository.save(user);
    return user;
  }

  async updateUserSeniority(currentUserId: number, seniority: UserSeniority): Promise<UserEntity> {
    const user = await this.findById(currentUserId);
    user.seniority = seniority;
    await this.userRepository.save(user);
    return user;
  }

  async login(user: UserEntity) {
    return {
      access_token: this.generateJwt(user),
    };
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
    );
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
      },
    };
  }
}

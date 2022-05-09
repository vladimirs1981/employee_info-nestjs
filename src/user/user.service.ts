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
import { CityEntity } from '../city/city.entity';
import { TechnologyEntity } from '../technology/technology.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CityEntity) private readonly cityRepository: Repository<CityEntity>,
    @InjectRepository(TechnologyEntity) private readonly technologyRepository: Repository<TechnologyEntity>,
  ) {}

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

  async addCityToUser(currentUserId: number, cityId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne(currentUserId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const city = await this.cityRepository.findOne(cityId);
    if (!user) {
      throw new HttpException('City not found', HttpStatus.NOT_FOUND);
    }
    user.city = city;

    return this.userRepository.save(user);
  }

  async addTechnologyToUser(currentUserId: number, technologyId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne(currentUserId, {
      relations: ['technologies'],
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const technology = await this.technologyRepository.findOne(technologyId);
    if (!technology) {
      throw new HttpException('Technology not found', HttpStatus.NOT_FOUND);
    }

    const isNotInTechnologies = user.technologies.findIndex(techInUser => techInUser.id === technology.id) === -1;

    if (isNotInTechnologies) {
      user.technologies.push(technology);
      await this.userRepository.save(user);
      await this.technologyRepository.save(technology);
    }

    return user;
  }

  async removeTechnologyFromUser(currentUserId: number, technologyId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne(currentUserId, {
      relations: ['technologies'],
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const technology = await this.technologyRepository.findOne(technologyId);
    if (!technology) {
      throw new HttpException('Technology not found', HttpStatus.NOT_FOUND);
    }

    const technologyIndex = await user.technologies.findIndex(techInUser => techInUser.id === technology.id);
    if (technologyIndex >= 0) {
      user.technologies.splice(technologyIndex, 1);
      await this.userRepository.save(user);
      await this.technologyRepository.save(technology);
    }
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

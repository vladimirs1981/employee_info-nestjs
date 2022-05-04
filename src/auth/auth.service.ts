import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/user.entity';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  async login(user: UserEntity) {
    return {
      access_token: sign(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
        },

        process.env.JWT_SECRET,
      ),
    };
  }

  async signInWithGoogle(data) {
    if (!data.user) {
      throw new BadRequestException();
    }

    let user = await this.userRepository.findOne({ where: { googleId: data.user.googleId } });

    if (user) {
      return this.login(user);
    }

    user = await this.userRepository.findOne({ where: { email: data.user.email } });
    if (user) {
      throw new ForbiddenException('User already exists, but Google account was not connected to user account');
    }

    try {
      const newUser = new UserEntity();
      newUser.firstName = data.user.firstName;
      newUser.lastName = data.user.lastName;
      newUser.email = data.user.email;
      newUser.googleId = data.user.googleId;

      await this.userRepository.save(newUser);
      return this.login(newUser);
    } catch (error) {
      throw new Error(error);
    }
  }
}

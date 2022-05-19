import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/user.entity';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  async login(user: UserEntity) {
    this.logger.debug(`Generated JWT token for user id: ${JSON.stringify(user.id)}`);
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
      user.googleId = data.user.googleId;
      await this.userRepository.save(user);
      return this.login(user);
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

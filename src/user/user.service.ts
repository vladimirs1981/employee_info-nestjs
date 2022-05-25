import { HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { UserEntity } from '@app/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { UpdateUserDto } from '@app/user/dto/updateUser.dto';
import { UserRole } from '@app/user/types/userRole.enum';
import { UserSeniority } from '@app/user/types/userSeniority.enum';
import { CityEntity } from '@app/city/city.entity';
import { TechnologyEntity } from '@app/technology/technology.entity';
import { ProjectEntity } from '@app/project/project.entity';
import { PostgresErrorCode } from '@app/database/postgresErrorCodes.enum';
import { Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UserService {
  private logger = new Logger('UserService');
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CityEntity) private readonly cityRepository: Repository<CityEntity>,
    @InjectRepository(TechnologyEntity) private readonly technologyRepository: Repository<TechnologyEntity>,
    @InjectRepository(ProjectEntity) private readonly projectRepository: Repository<ProjectEntity>,
  ) {}

  async findAllUsers(): Promise<UserEntity[]> {
    try {
      return this.userRepository.find({
        relations: ['city', 'city.country', 'project', 'project.projectManager', 'technologies'],
      });
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllEmployees(): Promise<UserEntity[]> {
    try {
      return this.userRepository.find({
        where: {
          role: UserRole.EMPLOYEE,
        },
      });
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllAdmins(): Promise<UserEntity[]> {
    try {
      return await this.userRepository.find({
        where: {
          role: UserRole.ADMIN,
        },
      });
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllPMs(): Promise<UserEntity[]> {
    try {
      return await this.userRepository.find({
        relations: ['pm_project'],
        where: {
          role: UserRole.PROJECT_MANAGER,
        },
      });
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createAdmin(userId: number): Promise<UserEntity> {
    try {
      const user = await this.findById(userId);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (user.role === UserRole.ADMIN) {
        throw new HttpException('User is already an admin', HttpStatus.UNPROCESSABLE_ENTITY);
      }
      if (user.role === UserRole.PROJECT_MANAGER) {
        const project = await this.projectRepository.findOne({
          // relations: ['projectManager'],
          where: {
            projectManagerId: user.id,
          },
        });

        if (project) {
          project.projectManager = null;
          await this.projectRepository.save(project);
        }
      }

      user.role = UserRole.ADMIN;
      return this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async removeFromAdmins(userId: number): Promise<UserEntity> {
    try {
      const user = await this.findById(userId);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      user.role = UserRole.EMPLOYEE;
      return this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async removeFromPMs(userId: number): Promise<UserEntity> {
    try {
      const user = await this.findById(userId);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const project = await this.projectRepository.findOne({
        relations: ['projectManager'],
        where: {
          projectManager: user,
        },
      });

      if (project) {
        project.projectManager = null;
        await this.projectRepository.save(project);
      }

      user.role = UserRole.EMPLOYEE;
      return await this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async createPm(userId: number): Promise<UserEntity> {
    try {
      const user = await this.findById(userId);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (user.role === UserRole.PROJECT_MANAGER) {
        throw new HttpException('User is already a project manager', HttpStatus.UNPROCESSABLE_ENTITY);
      }

      user.role = UserRole.PROJECT_MANAGER;
      return this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const userByEmail = await this.userRepository.findOne({
        email: createUserDto.email,
      });
      if (userByEmail) {
        throw new HttpException('Email is taken', HttpStatus.UNPROCESSABLE_ENTITY);
      }
      const newUser = new UserEntity();
      Object.assign(newUser, createUserDto);
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id: number): Promise<UserEntity> {
    try {
      const user = this.userRepository.findOne({
        where: {
          id,
        },
        relations: ['city', 'city.country', 'project', 'project.projectManager', 'technologies', 'pm_project'],
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    try {
      const user = await this.findById(userId);
      Object.assign(user, updateUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUserRole(currentUserId: number, role: UserRole): Promise<UserEntity> {
    try {
      const user = await this.findById(currentUserId);
      user.role = role;
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUserSeniority(currentUserId: number, seniority: UserSeniority): Promise<UserEntity> {
    try {
      const user = await this.findById(currentUserId);
      user.seniority = seniority;
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addCityToUser(currentUserId: number, cityId: number): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne(currentUserId);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const city = await this.cityRepository.findOne(cityId);
      if (!city) {
        throw new HttpException('City not found', HttpStatus.NOT_FOUND);
      }
      user.city = city;

      return this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async addProjectToUser(currentUserId: number, projectId: number): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne(currentUserId);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      if (user.role === UserRole.PROJECT_MANAGER || user.role === UserRole.ADMIN) {
        throw new HttpException('User must be employee in order to work on a project (not an admin or project manager)', HttpStatus.UNPROCESSABLE_ENTITY);
      }
      const project = await this.projectRepository.findOne(projectId);

      if (!project) {
        throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
      }
      user.project = project;

      return this.userRepository.save(user);
    } catch (error) {
      this.logger.error(`Something went wrong while adding user to project`, error.stack);
      throw error;
    }
  }

  async removeUserFromProject(userId: number): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne(userId);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      user.project = null;
      return this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async findAllUsersWithoutProject(): Promise<UserEntity[]> {
    try {
      const users = await this.userRepository.find({
        relations: ['project'],
        where: {
          project: null,
        },
      });

      return users;
    } catch (error) {
      throw error;
    }
  }

  async addTechnologyToUser(currentUserId: number, technologyId: number): Promise<UserEntity> {
    try {
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
    } catch (error) {
      throw error;
    }
  }

  async removeTechnologyFromUser(currentUserId: number, technologyId: number): Promise<UserEntity> {
    try {
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

      const technologyIndex = user.technologies.findIndex(techInUser => techInUser.id === technology.id);
      if (technologyIndex >= 0) {
        user.technologies.splice(technologyIndex, 1);
        await this.userRepository.save(user);
        await this.technologyRepository.save(technology);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async loginWithGoogle(token: string, response: Response) {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const googleUser = ticket.getPayload();

    console.log(googleUser);

    if (!googleUser) {
      throw new UnauthorizedException();
    }

    let user = await this.userRepository.findOne({ email: googleUser.email });

    if (!user) {
      user = await this.userRepository.save({
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        email: googleUser.email,
      });
    }

    const accessToken = sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },

      process.env.JWT_SECRET,
    );

    response.status(200);
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, //1 week
    });

    return {
      token: accessToken,
    };
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
      },
    };
  }
}

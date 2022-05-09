import { UserEntity } from '../user.entity';
export interface UsersResponseInterface {
  employees: UserEntity[];
  employeesCount: number;
}

import { UserEntity } from '../user.entity';
export interface UsersResponseInterface {
  employees: UserEntity[];
  employeesCount: number;
  current_page: number;
  last_page: number;
}

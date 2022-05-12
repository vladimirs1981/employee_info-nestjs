import { UserEntity } from '@app/user/user.entity';
export interface UsersResponseInterface {
  employees: UserEntity[];
  employeesCount: number;
  current_page: number;
  last_page: number;
}

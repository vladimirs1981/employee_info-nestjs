import { BadGatewayException, PipeTransform } from '@nestjs/common';
import { UserRole } from '@app/user/types/userRole.enum';

export class UserRoleValidationPipe implements PipeTransform {
  readonly allowedRoles = [UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.PROJECT_MANAGER];

  transform(value: any) {
    value = value.toLowerCase();

    if (!this.isRoleValid(value)) {
      throw new BadGatewayException(`"${value}" is an invalid role`);
    }

    return value;
  }

  private isRoleValid(role: any) {
    const idx = this.allowedRoles.indexOf(role);
    return idx !== -1;
  }
}

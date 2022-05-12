import { BadGatewayException, PipeTransform } from '@nestjs/common';
import { UserSeniority } from '@app/user/types/userSeniority.enum';

export class UserSeniorityValidationPipe implements PipeTransform {
  readonly allowedSeniorities = [UserSeniority.INTERN, UserSeniority.JUNIOR, UserSeniority.MEDIOR, UserSeniority.SENIOR];

  transform(value: any) {
    value = value.toLowerCase();

    if (!this.isSeniorityValid(value)) {
      throw new BadGatewayException(`"${value}" is an invalid seniority`);
    }

    return value;
  }

  private isSeniorityValid(seniority: any) {
    const idx = this.allowedSeniorities.indexOf(seniority);
    return idx !== -1;
  }
}

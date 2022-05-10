import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRelationsBetweenUserAndNotes1652188570242 implements MigrationInterface {
    name = 'AddRelationsBetweenUserAndNotes1652188570242'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notes" ADD "employeeId" integer`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_1663e00cb0271576c51393fa8cf" FOREIGN KEY ("employeeId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_1663e00cb0271576c51393fa8cf"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "employeeId"`);
    }

}

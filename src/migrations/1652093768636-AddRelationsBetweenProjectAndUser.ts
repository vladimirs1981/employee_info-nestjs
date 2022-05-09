import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRelationsBetweenProjectAndUser1652093768636 implements MigrationInterface {
    name = 'AddRelationsBetweenProjectAndUser1652093768636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "projectId" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_67689993ed1578f83ebf1b90781" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_67689993ed1578f83ebf1b90781"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "projectId"`);
    }

}

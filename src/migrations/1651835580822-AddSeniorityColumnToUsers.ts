import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSeniorityColumnToUsers1651835580822 implements MigrationInterface {
    name = 'AddSeniorityColumnToUsers1651835580822'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_seniority_enum" AS ENUM('intern', 'junior', 'medior', 'senior')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "seniority" "public"."users_seniority_enum" NOT NULL DEFAULT 'junior'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "seniority"`);
        await queryRunner.query(`DROP TYPE "public"."users_seniority_enum"`);
    }

}

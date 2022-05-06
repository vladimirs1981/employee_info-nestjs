import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTechnology1651843049874 implements MigrationInterface {
    name = 'CreateTechnology1651843049874'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "technologies" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_46800813f460eb131823371caee" UNIQUE ("name"), CONSTRAINT "PK_9a97465b79568f00becacdd4e4a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "technologies"`);
    }

}

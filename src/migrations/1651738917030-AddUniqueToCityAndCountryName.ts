import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUniqueToCityAndCountryName1651738917030 implements MigrationInterface {
    name = 'AddUniqueToCityAndCountryName1651738917030'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "countries" ADD CONSTRAINT "UQ_fa1376321185575cf2226b1491d" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "cities" ADD CONSTRAINT "UQ_a0ae8d83b7d32359578c486e7f6" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cities" DROP CONSTRAINT "UQ_a0ae8d83b7d32359578c486e7f6"`);
        await queryRunner.query(`ALTER TABLE "countries" DROP CONSTRAINT "UQ_fa1376321185575cf2226b1491d"`);
    }

}

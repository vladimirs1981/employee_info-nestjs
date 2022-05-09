import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRelationsBetweenCountryAndUser1652083066624 implements MigrationInterface {
    name = 'AddRelationsBetweenCountryAndUser1652083066624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "countryId" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_cc0dc7234854a65964f1a268275" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_cc0dc7234854a65964f1a268275"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "countryId"`);
    }

}

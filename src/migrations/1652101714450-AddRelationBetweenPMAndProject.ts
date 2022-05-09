import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRelationBetweenPMAndProject1652101714450 implements MigrationInterface {
    name = 'AddRelationBetweenPMAndProject1652101714450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" ADD "projectManagerId" integer`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "UQ_1fa4a36bc7ea7727a1ff25be92f" UNIQUE ("projectManagerId")`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_1fa4a36bc7ea7727a1ff25be92f" FOREIGN KEY ("projectManagerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_1fa4a36bc7ea7727a1ff25be92f"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "UQ_1fa4a36bc7ea7727a1ff25be92f"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "projectManagerId"`);
    }

}

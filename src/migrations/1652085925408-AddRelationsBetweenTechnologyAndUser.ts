import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRelationsBetweenTechnologyAndUser1652085925408 implements MigrationInterface {
    name = 'AddRelationsBetweenTechnologyAndUser1652085925408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_technologies_technologies" ("usersId" integer NOT NULL, "technologiesId" integer NOT NULL, CONSTRAINT "PK_17d1513677546f6e1d9b2a192af" PRIMARY KEY ("usersId", "technologiesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4b183e88b3aae55a5fe57087c8" ON "users_technologies_technologies" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a240ffc539cbea3857c1f147b3" ON "users_technologies_technologies" ("technologiesId") `);
        await queryRunner.query(`ALTER TABLE "users_technologies_technologies" ADD CONSTRAINT "FK_4b183e88b3aae55a5fe57087c8e" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_technologies_technologies" ADD CONSTRAINT "FK_a240ffc539cbea3857c1f147b34" FOREIGN KEY ("technologiesId") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_technologies_technologies" DROP CONSTRAINT "FK_a240ffc539cbea3857c1f147b34"`);
        await queryRunner.query(`ALTER TABLE "users_technologies_technologies" DROP CONSTRAINT "FK_4b183e88b3aae55a5fe57087c8e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a240ffc539cbea3857c1f147b3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4b183e88b3aae55a5fe57087c8"`);
        await queryRunner.query(`DROP TABLE "users_technologies_technologies"`);
    }

}

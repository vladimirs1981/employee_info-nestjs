import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb1652188570242 implements MigrationInterface {
  name = 'SeedDb1652188570242';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO countries (name) VALUES ('Serbia'), ('Macedonia'), ('Germany'), ('Ukraine'), ('Montenegro')`);

    await queryRunner.query(
      `INSERT INTO cities (name, "countryId") VALUES ('Belgrade', 2), ('Niš', 2), ('Čačak', 2), ('Skopje', 2), ('Berlin', 3), ('Frankfurth', 3), ('Kyiev', 4), ('Odessa', 4), ('Podgorica', 5), ('Tivat', 3), ('Cetinje', 3)`,
    );

    await queryRunner.query(
      `INSERT INTO technologies (name) VALUES ('JavaScript'), ('NodeJS'), ('HTML'), ('CSS'), ('Java'), ('jQuery'), ('React'), ('.NET'), ('Angular'), ('Vue')`,
    );

    await queryRunner.query(`INSERT INTO projects (name) VALUES ('Running App'), ('Love Chat App'), ('Sex App')`);

    await queryRunner.query(
      `INSERT INTO users ("firstName", "lastName", email, plan, "cityId", "projectId") VALUES ('Stefan', 'Meza', 'stefan.meza@quantox.com','Stefan Mezas evil plan', 3, 1), ('Miloš', 'Ćirić', 'milos.ciric@quantox.com','Milos Ciric evil plan', 4, 1), ('Danilo', 'Markićević', 'danilo.markicevic@quantox.com','Danilos evil plan', 5, 2), ('Vuk', 'Stojanovic', 'vuk.stojanovic@quantox.com','au au auuu plan', 6, 2), ('Sanja', 'Savić', 'sanja.savic@quantox.com','sanjas plan', 7, 3), ('Laza', 'Ivošević', 'laza.ivosevic@quantox.com','Lazass evil plan', 8, 3), ('Nemanja', 'Deljanin', 'nemanja.deljanin@quantox.com','Nemanjas evil plan', 9, 3), ('Srđan', 'Božić', 'srdjan.bozic@quantox.com','blh blh plan', 10, 3), ('Violeta', 'Petrović', 'violeta.petrovic@quantox.com','from leskovac plan', 2, 1), ('Milan', 'Stanojević', 'milan.stanojevic@quantox.com','who is this plan', 1, 2)`,
    );

    await queryRunner.query(
      `INSERT INTO notes ("createdBy", text, "employeeId") VALUES ('Stefan Meza', 'first note text', 5), ('Stefan Meza', 'second note text', 4), ('Miloš Ćirić', 'third note text', 4), ('Miloš Ćirić', 'fourth note text', 6), ('Stefan Meza', 'fifth note text', 3)`,
    );

    await queryRunner.query(
      `INSERT INTO users_technologies_technologies ("usersId", "technologiesId") VALUES (1,1), (1,2), (1,3), (2,1), (2,3), (3,4), (4,1), (5,10), (6,7), (6,8), (7,2), (8,9), (9,3), (9,6), (10,5), (10,1), (10,2)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

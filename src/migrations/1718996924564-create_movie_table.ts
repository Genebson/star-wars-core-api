import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMovieTable1718996924564 implements MigrationInterface {
    name = 'CreateMovieTable1718996924564'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "movie" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP, "deleted_at" TIMESTAMP, "title" character varying NOT NULL, "director" character varying NOT NULL, "opening_crawl" character varying NOT NULL, "release_date" TIMESTAMP NOT NULL, CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "movie"`);
    }

}

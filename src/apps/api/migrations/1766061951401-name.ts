import { MigrationInterface, QueryRunner } from "typeorm";

export class Name1766061951401 implements MigrationInterface {
    name = 'Name1766061951401'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_images" ("id" SERIAL NOT NULL, "filename" character varying NOT NULL, "path" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "product_id" integer, CONSTRAINT "PK_1974264ea7265989af8392f63a1" PRIMARY KEY ("id")); COMMENT ON COLUMN "product_images"."filename" IS 'Наименование картинки'; COMMENT ON COLUMN "product_images"."path" IS 'Путь к картинке'; COMMENT ON COLUMN "product_images"."created_at" IS 'Дата создания картинки'`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD CONSTRAINT "FK_4f166bb8c2bfcef2498d97b4068" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_images" DROP CONSTRAINT "FK_4f166bb8c2bfcef2498d97b4068"`);
        await queryRunner.query(`DROP TABLE "product_images"`);
    }

}

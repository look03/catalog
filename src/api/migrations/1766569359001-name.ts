import { MigrationInterface, QueryRunner } from "typeorm";

export class Name1766569359001 implements MigrationInterface {
    name = 'Name1766569359001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sync_meta" ("entityName" character varying NOT NULL, "lastSyncAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_3f5a4c7789ca2ae4bce300ab953" PRIMARY KEY ("entityName"))`);
        await queryRunner.query(`ALTER TABLE "product_images" DROP CONSTRAINT "FK_4f166bb8c2bfcef2498d97b4068"`);
        await queryRunner.query(`ALTER TABLE "product_images" ALTER COLUMN "product_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "active" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "products"."active" IS 'Активность товара'`);
        await queryRunner.query(`ALTER TABLE "sections" ALTER COLUMN "active" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "sections"."active" IS 'Активность раздела'`);
        await queryRunner.query(`ALTER TABLE "sections" DROP COLUMN "path"`);
        await queryRunner.query(`ALTER TABLE "sections" ADD "path" text`);
        await queryRunner.query(`COMMENT ON COLUMN "sections"."path" IS 'Путь к разделу'`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD CONSTRAINT "FK_4f166bb8c2bfcef2498d97b4068" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_images" DROP CONSTRAINT "FK_4f166bb8c2bfcef2498d97b4068"`);
        await queryRunner.query(`COMMENT ON COLUMN "sections"."path" IS 'Путь к разделу'`);
        await queryRunner.query(`ALTER TABLE "sections" DROP COLUMN "path"`);
        await queryRunner.query(`ALTER TABLE "sections" ADD "path" character varying`);
        await queryRunner.query(`COMMENT ON COLUMN "sections"."active" IS NULL`);
        await queryRunner.query(`ALTER TABLE "sections" ALTER COLUMN "active" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "products"."active" IS NULL`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "active" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_images" ALTER COLUMN "product_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD CONSTRAINT "FK_4f166bb8c2bfcef2498d97b4068" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "sync_meta"`);
    }

}

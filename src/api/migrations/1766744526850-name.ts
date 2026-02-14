import { MigrationInterface, QueryRunner } from "typeorm";

export class Name1766744526850 implements MigrationInterface {
    name = 'Name1766744526850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "roles" text NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
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
        await queryRunner.query(`DROP TABLE "users"`);
    }

}

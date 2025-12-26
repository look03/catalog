import { MigrationInterface, QueryRunner } from "typeorm";

export class Name1766750949540 implements MigrationInterface {
    name = 'Name1766750949540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_roles" ("user_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY ("user_id", "role_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") `);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roles"`);
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
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
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
        await queryRunner.query(`ALTER TABLE "users" ADD "roles" text NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b23c65e50a758245a33ee35fda"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_87b8888186ca9769c960e92687"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}

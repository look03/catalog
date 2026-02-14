import { MigrationInterface, QueryRunner } from "typeorm";

export class Name1766061794319 implements MigrationInterface {
    name = 'Name1766061794319'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_images" DROP CONSTRAINT "FK_96fabbb1202770b8e6a58bf6f1d"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "product_images_id_seq" OWNED BY "product_images"."id"`);
        await queryRunner.query(`ALTER TABLE "product_images" ALTER COLUMN "id" SET DEFAULT nextval('"product_images_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "product_images" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "product_images" ALTER COLUMN "filename" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "product_images"."filename" IS 'Наименование картинки'`);
        await queryRunner.query(`ALTER TABLE "product_images" DROP CONSTRAINT "UQ_b27820f9c4eb00f2afc4e5b6162"`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD CONSTRAINT "FK_4f166bb8c2bfcef2498d97b4068" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_images" DROP CONSTRAINT "FK_4f166bb8c2bfcef2498d97b4068"`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD CONSTRAINT "UQ_b27820f9c4eb00f2afc4e5b6162" UNIQUE ("path")`);
        await queryRunner.query(`COMMENT ON COLUMN "product_images"."filename" IS NULL`);
        await queryRunner.query(`ALTER TABLE "product_images" ALTER COLUMN "filename" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_images" ALTER COLUMN "id" SET DEFAULT nextval('images_id_seq')`);
        await queryRunner.query(`ALTER TABLE "product_images" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "product_images_id_seq"`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD CONSTRAINT "FK_96fabbb1202770b8e6a58bf6f1d" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSectionAndProductsTable1764171392986 implements MigrationInterface {
  name = 'AddSectionAndProductsTable1764171392986';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "images" ("id" SERIAL NOT NULL, "path" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "product_id" integer, CONSTRAINT "UQ_b27820f9c4eb00f2afc4e5b6162" UNIQUE ("path"), CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY ("id")); COMMENT ON COLUMN "images"."path" IS 'Путь к картинке'; COMMENT ON COLUMN "images"."created_at" IS 'Дата создания картинки'`,
    );
    await queryRunner.query(
      `CREATE TABLE "brands" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "code" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_96db6bbbaa6f23cad26871339b6" UNIQUE ("name"), CONSTRAINT "UQ_1687d82f42d8b3f8162a29e7df4" UNIQUE ("code"), CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id")); COMMENT ON COLUMN "brands"."name" IS 'Наименование бренда'; COMMENT ON COLUMN "brands"."code" IS 'Символьный код бренда'; COMMENT ON COLUMN "brands"."created_at" IS 'Дата добавления бренда'; COMMENT ON COLUMN "brands"."updated_at" IS 'Дата изменения бренда'`,
    );
    await queryRunner.query(
      `CREATE TABLE "products" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "code" character varying NOT NULL, "price" double precision NOT NULL, "color" character varying, "preview_text" text, "view_main_page" boolean NOT NULL, "slider_on_main_page" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "brand_id" integer, CONSTRAINT "UQ_c30f00a871de74c8e8c213acc4a" UNIQUE ("title"), CONSTRAINT "UQ_7cfc24d6c24f0ec91294003d6b8" UNIQUE ("code"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id")); COMMENT ON COLUMN "products"."title" IS 'Наименование товара'; COMMENT ON COLUMN "products"."code" IS 'Символьный код товара'; COMMENT ON COLUMN "products"."price" IS 'Цена товара'; COMMENT ON COLUMN "products"."color" IS 'Цвет товара (hex)'; COMMENT ON COLUMN "products"."preview_text" IS 'Краткое описание товара'; COMMENT ON COLUMN "products"."view_main_page" IS 'Признак отображения товара на главной странице'; COMMENT ON COLUMN "products"."slider_on_main_page" IS 'Признак отображения товара в слайдере на главной странице'; COMMENT ON COLUMN "products"."created_at" IS 'Дата создания товара'; COMMENT ON COLUMN "products"."updated_at" IS 'Дата последнего изменения товара'`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_sections" ("id" SERIAL NOT NULL, "product_id" integer, "section_id" integer NOT NULL, CONSTRAINT "UQ_15527252c3f6e839c7e1712fa02" UNIQUE ("product_id", "section_id"), CONSTRAINT "PK_fe263140229eccc82ae2a75e46d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sections" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "code" character varying NOT NULL, "parent_section_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c673c8ef8cac3fe461b73297f36" UNIQUE ("title"), CONSTRAINT "UQ_8abcae323050fbeb87150c6f78f" UNIQUE ("code"), CONSTRAINT "PK_f9749dd3bffd880a497d007e450" PRIMARY KEY ("id")); COMMENT ON COLUMN "sections"."title" IS 'Наименование раздела'; COMMENT ON COLUMN "sections"."code" IS 'Символьный код раздела'; COMMENT ON COLUMN "sections"."parent_section_id" IS 'Привязка к родительскому разделу товара'; COMMENT ON COLUMN "sections"."created_at" IS 'Дата создания товара'; COMMENT ON COLUMN "sections"."updated_at" IS 'Дата последнего изменения товара'`,
    );
    await queryRunner.query(
      `ALTER TABLE "images" ADD CONSTRAINT "FK_96fabbb1202770b8e6a58bf6f1d" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_1530a6f15d3c79d1b70be98f2be" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_sections" ADD CONSTRAINT "FK_0e6bd1dd79df29bee1e3aad876d" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_sections" ADD CONSTRAINT "FK_1fd2b498145065df2303b96d49a" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_sections" DROP CONSTRAINT "FK_1fd2b498145065df2303b96d49a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_sections" DROP CONSTRAINT "FK_0e6bd1dd79df29bee1e3aad876d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_1530a6f15d3c79d1b70be98f2be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "images" DROP CONSTRAINT "FK_96fabbb1202770b8e6a58bf6f1d"`,
    );
    await queryRunner.query(`DROP TABLE "sections"`);
    await queryRunner.query(`DROP TABLE "product_sections"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "brands"`);
    await queryRunner.query(`DROP TABLE "images"`);
  }
}

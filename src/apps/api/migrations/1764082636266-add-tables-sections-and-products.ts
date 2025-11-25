import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTablesSectionsAndProducts1764082636266 implements MigrationInterface {
  name = 'AddTablesSectionsAndProducts1764082636266';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "products" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "code" character varying NOT NULL, "image" character varying NOT NULL, "price" double precision NOT NULL, "color" character varying NOT NULL, "preview_text" text NOT NULL, "section_id" integer NOT NULL, "view_main_page" boolean NOT NULL, "slider_on_main_page" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "sectionId" integer, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id")); COMMENT ON COLUMN "products"."title" IS 'Наименование товара'; COMMENT ON COLUMN "products"."code" IS 'Символьный код товара'; COMMENT ON COLUMN "products"."image" IS 'Путь к картинке товара'; COMMENT ON COLUMN "products"."price" IS 'Цена товара'; COMMENT ON COLUMN "products"."color" IS 'Цвет товара (hex)'; COMMENT ON COLUMN "products"."preview_text" IS 'Краткое описание товара'; COMMENT ON COLUMN "products"."section_id" IS 'Привязка к разделу товара'; COMMENT ON COLUMN "products"."view_main_page" IS 'Признак отображения товара на главной странице'; COMMENT ON COLUMN "products"."slider_on_main_page" IS 'Признак отображения товара в слайдере на главной странице'; COMMENT ON COLUMN "products"."created_at" IS 'Дата создания товара'; COMMENT ON COLUMN "products"."updated_at" IS 'Дата последнего изменения товара'`,
    );
    await queryRunner.query(
      `CREATE TABLE "sections" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "code" character varying NOT NULL, "image" character varying NOT NULL, "parent_section_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f9749dd3bffd880a497d007e450" PRIMARY KEY ("id")); COMMENT ON COLUMN "sections"."title" IS 'Наименование раздела'; COMMENT ON COLUMN "sections"."code" IS 'Символьный код раздела'; COMMENT ON COLUMN "sections"."image" IS 'Путь к картинке раздела'; COMMENT ON COLUMN "sections"."parent_section_id" IS 'Привязка к родительскому разделу товара'; COMMENT ON COLUMN "sections"."created_at" IS 'Дата создания товара'; COMMENT ON COLUMN "sections"."updated_at" IS 'Дата последнего изменения товара'`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_a6f699e2287d19941ff7b557270" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_a6f699e2287d19941ff7b557270"`,
    );
    await queryRunner.query(`DROP TABLE "sections"`);
    await queryRunner.query(`DROP TABLE "products"`);
  }
}

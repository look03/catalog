import { MigrationInterface, QueryRunner } from 'typeorm';

export class Name1765973852368 implements MigrationInterface {
  name = 'Name1765973852368';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "sections"."parent_section_id" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "sections" ADD CONSTRAINT "FK_b11611007431b3bac1576fac76c" FOREIGN KEY ("parent_section_id") REFERENCES "sections"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sections" DROP CONSTRAINT "FK_b11611007431b3bac1576fac76c"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "sections"."parent_section_id" IS 'Привязка к родительскому разделу товара'`,
    );
  }
}

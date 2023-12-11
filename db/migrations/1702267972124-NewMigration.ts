import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1702267972124 implements MigrationInterface {
    name = 'NewMigration1702267972124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "historic" ALTER COLUMN "created_at" SET DEFAULT '"2023-12-11T04:12:52.438Z"'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '"2023-12-11T04:12:52.440Z"'`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "created_at" SET DEFAULT '"2023-12-11T04:12:52.440Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "created_at" SET DEFAULT '2023-12-11 04:09:20.706'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '2023-12-11 04:09:20.707'`);
        await queryRunner.query(`ALTER TABLE "historic" ALTER COLUMN "created_at" SET DEFAULT '2023-12-11 04:09:20.703'`);
    }

}

import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';

export class SeedRoles1590832000335 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const roles = await getRepository('role').save([
      {
        id:1,
        name: 'admin',
      },
      {
        id:2,
        name: 'user',
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

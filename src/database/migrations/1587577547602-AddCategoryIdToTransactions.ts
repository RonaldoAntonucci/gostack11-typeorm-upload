import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddCategoryIdToTransactions1587577547602
  implements MigrationInterface {
  private tableName = 'transactions';

  private categoryColumn = new TableColumn({
    name: 'category_id',
    type: 'uuid',
    isNullable: true,
  });

  private categoryForeignKey = new TableForeignKey({
    name: 'TransactionCategory',
    columnNames: ['category_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'categories',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(this.tableName, this.categoryColumn);
    await queryRunner.createForeignKey(this.tableName, this.categoryForeignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(this.tableName, this.categoryForeignKey);
    await queryRunner.dropColumn(this.tableName, this.categoryColumn);
  }
}

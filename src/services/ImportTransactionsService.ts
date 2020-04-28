import { getRepository, getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';

import CategoryRepository from '../repositories/CategoriesRepository';

import loadCSV from '../util/loadCSV';

interface RequestDTO {
  filePath: string;
}

class ImportTransactionsService {
  async execute({ filePath }: RequestDTO): Promise<Transaction[]> {
    const data = await loadCSV(filePath);

    const transactionsRepository = getRepository(Transaction);
    const categoryRepository = getCustomRepository(CategoryRepository);

    const categoriesNames: string[] = data.map(
      transactions => transactions.category,
    );
    const noRepeatCategoriesNames: string[] = categoriesNames.filter(
      (current, i) => categoriesNames.indexOf(current) === i,
    );

    await Promise.all(
      noRepeatCategoriesNames.map(categoryName =>
        categoryRepository.findOrCreate(categoryName),
      ),
    );

    const formattedValues = await Promise.all(
      data.map(async d => ({
        ...d,
        value: Number(d.value),
        category_id: (await categoryRepository.findOrCreate(d.category)).id,
      })),
    );

    const transactions = transactionsRepository.create(formattedValues);

    await transactionsRepository.save(transactions);

    return transactions;
  }
}

export default ImportTransactionsService;

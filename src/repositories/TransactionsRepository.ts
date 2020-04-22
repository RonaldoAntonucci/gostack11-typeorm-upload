import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    let incomeValues = 0;
    let outcomeValues = 0;

    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        incomeValues += transaction.value;
      } else if (transaction.type === 'outcome') {
        outcomeValues += transaction.value;
      }
    });

    const balance = {
      income: incomeValues,
      outcome: outcomeValues,
      total: incomeValues - outcomeValues,
    };

    return balance;
  }
}

export default TransactionsRepository;

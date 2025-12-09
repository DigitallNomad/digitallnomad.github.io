export type TransactionType = "income" | "expense";

export type CategoryType = 
  | "food"
  | "transport"
  | "shopping"
  | "entertainment"
  | "health"
  | "bills"
  | "groceries"
  | "education"
  | "travel"
  | "salary"
  | "freelance"
  | "investment"
  | "other";

export interface Account {
  id: string;
  name: string;
  balance: number;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: CategoryType;
  accountId: string;
  description: string;
  date: Date;
}

export interface Budget {
  id: string;
  category: CategoryType;
  limit: number;
  spent: number;
  month: string;
}

export interface Category {
  id: CategoryType;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

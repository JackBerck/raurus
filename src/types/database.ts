export type TransactionType = 'expense' | 'income';

export interface Category {
  id: string;
  user_id: string | null;
  name: string;
  type: 'expense' | 'income' | 'both';
  icon: string | null;
  color: string | null;
  created_at: string;
}

export interface Provider {
  id: string;
  user_id: string | null;
  name: string;
  icon: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string | null;
  type: TransactionType;
  title: string;
  description: string | null;
  amount: number;
  quantity: number;
  total: number;
  category_id: string | null;
  provider_id: string | null;
  occurred_at: string;
  created_at: string;
  raw_input: string | null;

  // Joined relations (optional)
  category?: Category | null;
  provider?: Provider | null;
}

export interface ParsedTransactionAI {
  type: TransactionType;
  title: string;
  description?: string | null;
  amount: number;
  quantity: number;
  total: number;
  category: string;
  provider: string;
  occurred_at: string;
}

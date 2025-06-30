// === TIPOS DE DATOS ===
export interface User {
  id: string;
  auth_id: string;
  email: string;
  username: string;
  display_name: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  transaction_date: string;
  created_at: string;
  updated_at: string;
  // Relaciones
  category?: Category;
  // Compatibilidad con código existente
  date?: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  period: 'monthly' | 'yearly';
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  // Relaciones
  category?: Category;
}

// === TIPOS DE RESPUESTA DE LA API ===
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface TransactionStats {
  total_income: number;
  total_expenses: number;
  net_balance: number;
  transactions_count: number;
  avg_transaction_amount: number;
}

export interface MonthlyTrend {
  month: string;
  year: number;
  income: number;
  expenses: number;
  net: number;
}

export interface CategoryStats {
  category_id: string;
  category_name: string;
  total_amount: number;
  transaction_count: number;
  percentage: number;
}

// === TIPOS DE FORMULARIOS ===
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  username: string;
  display_name: string;
}

export interface TransactionForm {
  category_id: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  transaction_date: string;
}

export interface CategoryForm {
  name: string;
  icon: string;
  color: string;
}

export interface BudgetForm {
  category_id: string;
  amount: number;
  period: 'monthly' | 'yearly';
  start_date: string;
  end_date?: string;
}

// === TIPOS DE FILTROS ===
export interface TransactionFilters {
  type?: 'income' | 'expense';
  category_id?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
}

// === TIPOS DE NAVEGACIÓN ===
export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  description?: string;
}

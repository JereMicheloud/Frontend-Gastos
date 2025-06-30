import { useState, useEffect } from 'react';
import { TransactionService, handleApiError } from '@/lib/api';
import { Transaction, TransactionForm, TransactionFilters, TransactionStats } from '@/types';

/**
 * Hook para manejar transacciones
 */
export const useTransactions = (filters?: TransactionFilters) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await TransactionService.getTransactions(filters);
      setTransactions(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (data: TransactionForm): Promise<Transaction | null> => {
    try {
      const newTransaction = await TransactionService.createTransaction(data);
      setTransactions(prev => [newTransaction, ...prev]);
      return newTransaction;
    } catch (err) {
      setError(handleApiError(err));
      return null;
    }
  };

  const updateTransaction = async (id: string, data: Partial<TransactionForm>): Promise<Transaction | null> => {
    try {
      const updatedTransaction = await TransactionService.updateTransaction(id, data);
      setTransactions(prev => 
        prev.map(t => t.id === id ? updatedTransaction : t)
      );
      return updatedTransaction;
    } catch (err) {
      setError(handleApiError(err));
      return null;
    }
  };

  const deleteTransaction = async (id: string): Promise<boolean> => {
    try {
      await TransactionService.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      return true;
    } catch (err) {
      setError(handleApiError(err));
      return false;
    }
  };

  const refreshTransactions = () => {
    fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, [JSON.stringify(filters)]);

  return {
    transactions,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions,
  };
};

/**
 * Hook para obtener estadísticas de transacciones
 */
export const useTransactionStats = (period?: string) => {
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await TransactionService.getStats(period);
      setStats(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [period]);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats,
  };
};

/**
 * Hook para obtener una transacción específica
 */
export const useTransaction = (id: string | null) => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransaction = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await TransactionService.getTransaction(id);
      setTransaction(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  return {
    transaction,
    loading,
    error,
    refreshTransaction: fetchTransaction,
  };
};

/**
 * Hook para obtener transacciones recientes
 */
export const useRecentTransactions = (limit: number = 10) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await TransactionService.getRecentTransactions(limit);
      setTransactions(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentTransactions();
  }, [limit]);

  return {
    transactions,
    loading,
    error,
    refreshTransactions: fetchRecentTransactions,
  };
};

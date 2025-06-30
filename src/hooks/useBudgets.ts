import { useState, useEffect } from 'react';
import { BudgetService, handleApiError } from '@/lib/api';
import { Budget, BudgetForm } from '@/types';

/**
 * Hook para manejar presupuestos
 */
export const useBudgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await BudgetService.getBudgets();
      setBudgets(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const createBudget = async (data: BudgetForm): Promise<Budget | null> => {
    try {
      const newBudget = await BudgetService.createBudget(data);
      setBudgets(prev => [...prev, newBudget]);
      return newBudget;
    } catch (err) {
      setError(handleApiError(err));
      return null;
    }
  };

  const updateBudget = async (id: string, data: Partial<BudgetForm>): Promise<Budget | null> => {
    try {
      const updatedBudget = await BudgetService.updateBudget(id, data);
      setBudgets(prev => 
        prev.map(b => b.id === id ? updatedBudget : b)
      );
      return updatedBudget;
    } catch (err) {
      setError(handleApiError(err));
      return null;
    }
  };

  const deleteBudget = async (id: string): Promise<boolean> => {
    try {
      await BudgetService.deleteBudget(id);
      setBudgets(prev => prev.filter(b => b.id !== id));
      return true;
    } catch (err) {
      setError(handleApiError(err));
      return false;
    }
  };

  const refreshBudgets = () => {
    fetchBudgets();
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  return {
    budgets,
    loading,
    error,
    createBudget,
    updateBudget,
    deleteBudget,
    refreshBudgets,
  };
};

/**
 * Hook para obtener un presupuesto específico
 */
export const useBudget = (id: string | null) => {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBudget = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await BudgetService.getBudget(id);
      setBudget(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, [id]);

  return {
    budget,
    loading,
    error,
    refreshBudget: fetchBudget,
  };
};

/**
 * Hook para obtener presupuestos activos
 */
export const useActiveBudgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveBudgets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await BudgetService.getActiveBudgets();
      setBudgets(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveBudgets();
  }, []);

  return {
    budgets,
    loading,
    error,
    refreshBudgets: fetchActiveBudgets,
  };
};

/**
 * Hook para obtener análisis de presupuesto
 */
export const useBudgetAnalysis = (id: string | null) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await BudgetService.getBudgetAnalysis(id);
      setAnalysis(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [id]);

  return {
    analysis,
    loading,
    error,
    refreshAnalysis: fetchAnalysis,
  };
};

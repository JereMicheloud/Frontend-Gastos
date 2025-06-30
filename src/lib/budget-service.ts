import { apiClient } from './api-client';
import { 
  ApiResponse, 
  Budget, 
  BudgetForm
} from '../types';

export class BudgetService {
  /**
   * Obtener todos los presupuestos del usuario
   */
  static async getBudgets(): Promise<Budget[]> {
    const response = await apiClient.get<ApiResponse<Budget[]>>('/api/budgets');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Error al obtener presupuestos');
  }

  /**
   * Obtener un presupuesto específico por ID
   */
  static async getBudget(id: string): Promise<Budget> {
    const response = await apiClient.get<ApiResponse<Budget>>(`/api/budgets/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Error al obtener presupuesto');
  }

  /**
   * Crear nuevo presupuesto
   */
  static async createBudget(data: BudgetForm): Promise<Budget> {
    const response = await apiClient.post<ApiResponse<Budget>>('/api/budgets', data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Error al crear presupuesto');
  }

  /**
   * Actualizar presupuesto existente
   */
  static async updateBudget(id: string, data: Partial<BudgetForm>): Promise<Budget> {
    const response = await apiClient.put<ApiResponse<Budget>>(`/api/budgets/${id}`, data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Error al actualizar presupuesto');
  }

  /**
   * Eliminar presupuesto
   */
  static async deleteBudget(id: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/budgets/${id}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Error al eliminar presupuesto');
    }
  }

  /**
   * Obtener presupuestos activos (vigentes)
   */
  static async getActiveBudgets(): Promise<Budget[]> {
    const response = await apiClient.get<ApiResponse<Budget[]>>('/api/budgets/active');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Error al obtener presupuestos activos');
  }

  /**
   * Obtener análisis de presupuesto (gasto actual vs presupuesto)
   */
  static async getBudgetAnalysis(id: string): Promise<{
    budget: Budget;
    spent: number;
    remaining: number;
    percentage: number;
    daysRemaining: number;
  }> {
    const response = await apiClient.get<ApiResponse<any>>(`/api/budgets/${id}/analysis`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Error al obtener análisis de presupuesto');
  }

  /**
   * Obtener resumen de todos los presupuestos
   */
  static async getBudgetsSummary(): Promise<{
    total_budgets: number;
    total_allocated: number;
    total_spent: number;
    total_remaining: number;
    over_budget_count: number;
  }> {
    const response = await apiClient.get<ApiResponse<any>>('/api/budgets/summary');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Error al obtener resumen de presupuestos');
  }

  // === MÉTODOS DE UTILIDAD ===

  /**
   * Obtener presupuestos por período
   */
  static async getBudgetsByPeriod(period: 'monthly' | 'yearly'): Promise<Budget[]> {
    const budgets = await this.getBudgets();
    return budgets.filter(budget => budget.period === period);
  }

  /**
   * Obtener presupuestos por categoría
   */
  static async getBudgetsByCategory(categoryId: string): Promise<Budget[]> {
    const budgets = await this.getBudgets();
    return budgets.filter(budget => budget.category_id === categoryId);
  }

  /**
   * Verificar si existe presupuesto para una categoría y período
   */
  static async hasBudgetForCategory(categoryId: string, period: 'monthly' | 'yearly'): Promise<boolean> {
    const budgets = await this.getBudgets();
    return budgets.some(budget => 
      budget.category_id === categoryId && 
      budget.period === period &&
      new Date(budget.start_date) <= new Date() &&
      (!budget.end_date || new Date(budget.end_date) >= new Date())
    );
  }

  /**
   * Calcular progreso de presupuesto (requiere datos de transacciones)
   */
  static calculateBudgetProgress(budget: Budget, spentAmount: number): {
    percentage: number;
    remaining: number;
    isOverBudget: boolean;
    status: 'good' | 'warning' | 'danger';
  } {
    const percentage = (spentAmount / budget.amount) * 100;
    const remaining = budget.amount - spentAmount;
    const isOverBudget = spentAmount > budget.amount;

    let status: 'good' | 'warning' | 'danger' = 'good';
    if (percentage >= 100) {
      status = 'danger';
    } else if (percentage >= 80) {
      status = 'warning';
    }

    return {
      percentage: Math.min(percentage, 100),
      remaining,
      isOverBudget,
      status
    };
  }

  /**
   * Obtener días restantes en el período del presupuesto
   */
  static getDaysRemainingInPeriod(budget: Budget): number {
    const now = new Date();
    const endDate = budget.end_date ? new Date(budget.end_date) : null;
    
    if (!endDate) {
      // Si no hay fecha de fin, calcular basado en el período
      const startDate = new Date(budget.start_date);
      const nextPeriodEnd = new Date(startDate);
      
      if (budget.period === 'monthly') {
        nextPeriodEnd.setMonth(nextPeriodEnd.getMonth() + 1);
      } else {
        nextPeriodEnd.setFullYear(nextPeriodEnd.getFullYear() + 1);
      }
      
      return Math.max(0, Math.ceil((nextPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    }
    
    return Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  }
}

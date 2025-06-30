import { apiClient } from './api-client';
import { 
  ApiResponse, 
  Transaction, 
  TransactionForm, 
  TransactionFilters,
  TransactionStats,
  MonthlyTrend,
  CategoryStats
} from '../types';

export class TransactionService {
  /**
   * Obtener todas las transacciones del usuario con filtros opcionales
   */
  static async getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
    const response = await apiClient.get<ApiResponse<Transaction[]>>('/api/transactions', filters);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Error al obtener transacciones');
  }

  /**
   * Obtener una transacción específica por ID
   */
  static async getTransaction(id: string): Promise<Transaction> {
    const response = await apiClient.get<ApiResponse<Transaction>>(`/api/transactions/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Error al obtener transacción');
  }

  /**
   * Crear nueva transacción
   */
  static async createTransaction(data: TransactionForm): Promise<Transaction> {
    const response = await apiClient.post<ApiResponse<Transaction>>('/api/transactions', data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Error al crear transacción');
  }

  /**
   * Actualizar transacción existente
   */
  static async updateTransaction(id: string, data: Partial<TransactionForm>): Promise<Transaction> {
    const response = await apiClient.put<ApiResponse<Transaction>>(`/api/transactions/${id}`, data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Error al actualizar transacción');
  }

  /**
   * Eliminar transacción
   */
  static async deleteTransaction(id: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/transactions/${id}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Error al eliminar transacción');
    }
  }

  /**
   * Obtener estadísticas de transacciones
   */
  static async getStats(period?: string): Promise<TransactionStats> {
    const params = period ? { period } : undefined;
    const response = await apiClient.get<ApiResponse<TransactionStats>>('/api/transactions/stats', params);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Error al obtener estadísticas');
  }

  /**
   * Obtener tendencias mensuales
   */
  static async getMonthlyTrends(months?: number): Promise<MonthlyTrend[]> {
    const params = months ? { months } : undefined;
    const response = await apiClient.get<ApiResponse<MonthlyTrend[]>>('/api/transactions/trends', params);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Error al obtener tendencias');
  }

  /**
   * Obtener gastos por categoría
   */
  static async getCategoryStats(period?: string): Promise<CategoryStats[]> {
    const params = period ? { period } : undefined;
    const response = await apiClient.get<ApiResponse<CategoryStats[]>>('/api/transactions/category-stats', params);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Error al obtener estadísticas por categoría');
  }

  /**
   * Obtener transacciones recientes
   */
  static async getRecentTransactions(limit: number = 10): Promise<Transaction[]> {
    return this.getTransactions({ limit });
  }

  /**
   * Obtener transacciones por rango de fechas
   */
  static async getTransactionsByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    return this.getTransactions({ start_date: startDate, end_date: endDate });
  }

  /**
   * Obtener transacciones por tipo
   */
  static async getTransactionsByType(type: 'income' | 'expense'): Promise<Transaction[]> {
    return this.getTransactions({ type });
  }

  /**
   * Obtener transacciones por categoría
   */
  static async getTransactionsByCategory(categoryId: string): Promise<Transaction[]> {
    return this.getTransactions({ category_id: categoryId });
  }
}

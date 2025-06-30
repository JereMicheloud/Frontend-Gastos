import { apiClient } from './api-client';
import { 
  ApiResponse, 
  Category, 
  CategoryForm
} from '../types';

export class CategoryService {
  /**
   * Obtener todas las categorías del usuario
   */
  static async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<ApiResponse<Category[]>>('/api/categories');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Error al obtener categorías');
  }

  /**
   * Obtener una categoría específica por ID
   */
  static async getCategory(id: string): Promise<Category> {
    const response = await apiClient.get<ApiResponse<Category>>(`/api/categories/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Error al obtener categoría');
  }

  /**
   * Crear nueva categoría
   */
  static async createCategory(data: CategoryForm): Promise<Category> {
    const response = await apiClient.post<ApiResponse<Category>>('/api/categories', data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Error al crear categoría');
  }

  /**
   * Actualizar categoría existente
   */
  static async updateCategory(id: string, data: Partial<CategoryForm>): Promise<Category> {
    const response = await apiClient.put<ApiResponse<Category>>(`/api/categories/${id}`, data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Error al actualizar categoría');
  }

  /**
   * Eliminar categoría
   */
  static async deleteCategory(id: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/categories/${id}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Error al eliminar categoría');
    }
  }

  /**
   * Obtener categorías por defecto del sistema
   */
  static async getDefaultCategories(): Promise<Category[]> {
    const response = await apiClient.get<ApiResponse<Category[]>>('/api/categories/defaults');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Error al obtener categorías por defecto');
  }

  /**
   * Crear categorías por defecto para un usuario nuevo
   */
  static async createDefaultCategories(): Promise<Category[]> {
    const response = await apiClient.post<ApiResponse<Category[]>>('/api/categories/create-defaults');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Error al crear categorías por defecto');
  }

  // === MÉTODOS DE UTILIDAD ===

  /**
   * Buscar categorías por nombre
   */
  static async searchCategories(query: string): Promise<Category[]> {
    const categories = await this.getCategories();
    return categories.filter(category => 
      category.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Obtener categorías de ingresos (basado en uso)
   */
  static async getIncomeCategories(): Promise<Category[]> {
    // Esta lógica podría mejorarse con información del backend
    const categories = await this.getCategories();
    const incomeKeywords = ['salario', 'ingreso', 'bonus', 'comision', 'freelance', 'renta'];
    
    return categories.filter(category => 
      incomeKeywords.some(keyword => 
        category.name.toLowerCase().includes(keyword)
      )
    );
  }

  /**
   * Obtener categorías de gastos (basado en uso)
   */
  static async getExpenseCategories(): Promise<Category[]> {
    // Esta lógica podría mejorarse con información del backend
    const categories = await this.getCategories();
    const expenseKeywords = ['comida', 'transporte', 'entretenimiento', 'casa', 'salud', 'compras'];
    
    return categories.filter(category => 
      expenseKeywords.some(keyword => 
        category.name.toLowerCase().includes(keyword)
      )
    );
  }

  /**
   * Validar si una categoría puede ser eliminada (no tiene transacciones asociadas)
   */
  static async canDeleteCategory(id: string): Promise<boolean> {
    try {
      // Esto requeriría un endpoint en el backend para verificar
      // Por ahora retornamos true, pero en producción debería verificar
      const response = await apiClient.get<ApiResponse<{ canDelete: boolean }>>(`/api/categories/${id}/can-delete`);
      return response.data?.canDelete ?? true;
    } catch {
      // Si no existe el endpoint, asumimos que se puede eliminar
      return true;
    }
  }
}

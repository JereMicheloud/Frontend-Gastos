// Exportar cliente API principal
export { apiClient } from './api-client';

// Exportar servicios
export { AuthService } from './auth-service';
export { TransactionService } from './transaction-service';
export { CategoryService } from './category-service';
export { BudgetService } from './budget-service';

// Exportar tipos
export * from '../types';

// === FUNCIONES DE UTILIDAD PARA LA API ===

/**
 * Manejar errores de la API de forma consistente
 */
export const handleApiError = (error: any): string => {
  // Si es un error de red o servidor sin respuesta
  if (!error.response) {
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      return 'Error de conexión. Verifica tu conexión a internet.';
    }
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return 'La solicitud ha excedido el tiempo límite. Intenta nuevamente.';
    }
    return error.message || 'Error de conexión con el servidor';
  }

  // Errores con respuesta del servidor
  const status = error.response.status;
  const data = error.response.data;

  // Mensajes específicos por código de estado
  switch (status) {
    case 400:
      return data?.message || 'Datos de solicitud inválidos';
    case 401:
      return 'Credenciales inválidas o sesión expirada';
    case 403:
      return 'No tienes permisos para realizar esta acción';
    case 404:
      return 'Recurso no encontrado';
    case 409:
      return data?.message || 'Conflicto con los datos existentes';
    case 422:
      return data?.message || 'Datos de validación incorrectos';
    case 500:
      return 'Error interno del servidor. Intenta más tarde.';
    case 502:
    case 503:
    case 504:
      return 'Servidor temporalmente no disponible. Intenta más tarde.';
    default:
      return data?.message || `Error del servidor (${status})`;
  }
};

/**
 * Formatear fechas para la API
 */
export const formatDateForApi = (date: Date | string): string => {
  if (typeof date === 'string') {
    return date;
  }
  
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

/**
 * Formatear fecha y hora para la API
 */
export const formatDateTimeForApi = (date: Date | string): string => {
  if (typeof date === 'string') {
    return date;
  }
  
  return date.toISOString(); // ISO 8601 completo
};

/**
 * Validar si una cadena es una fecha válida
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Formatear cantidad para mostrar
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Obtener configuración de la API basada en el entorno
 */
export const getApiConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    baseURL: isDevelopment 
      ? process.env.NEXT_PUBLIC_API_URL 
      : process.env.NEXT_PUBLIC_API_URL_PRODUCTION,
    timeout: 10000,
    retries: 3,
    retryDelay: 1000,
  };
};

/**
 * Verificar si la API está disponible
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${getApiConfig().baseURL}/health`);
    return response.ok;
  } catch {
    return false;
  }
};
import type { Transaction, Category } from '@/types';

// Categorías mock actualizadas
export const mockCategoriesData: Category[] = [
  { 
    id: 'salary', 
    name: 'Salario', 
    icon: '💰', 
    color: '#10B981', 
    user_id: 'mock-user', 
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString() 
  },
  { 
    id: 'food', 
    name: 'Alimentación', 
    icon: '🍽️', 
    color: '#F59E0B', 
    user_id: 'mock-user', 
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString() 
  },
  { 
    id: 'housing', 
    name: 'Vivienda', 
    icon: '🏠', 
    color: '#3B82F6', 
    user_id: 'mock-user', 
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString() 
  },
  { 
    id: 'utilities', 
    name: 'Servicios', 
    icon: '⚡', 
    color: '#8B5CF6', 
    user_id: 'mock-user', 
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString() 
  },
  { 
    id: 'entertainment', 
    name: 'Entretenimiento', 
    icon: '🎬', 
    color: '#EF4444', 
    user_id: 'mock-user', 
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString() 
  },
  { 
    id: 'transport', 
    name: 'Transporte', 
    icon: '🚌', 
    color: '#06B6D4', 
    user_id: 'mock-user', 
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString() 
  },
  { 
    id: 'healthcare', 
    name: 'Salud', 
    icon: '🩺', 
    color: '#84CC16', 
    user_id: 'mock-user', 
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString() 
  },
  { 
    id: 'gifts', 
    name: 'Regalos', 
    icon: '🎁', 
    color: '#EC4899', 
    user_id: 'mock-user', 
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString() 
  },
  { 
    id: 'other', 
    name: 'Otros', 
    icon: '❓', 
    color: '#6B7280', 
    user_id: 'mock-user', 
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString() 
  },
];

// Transacciones mock actualizadas
export const mockTransactionsData: Transaction[] = [
  { 
    id: '1', 
    user_id: 'mock-user', 
    category_id: 'salary', 
    transaction_date: new Date(2024, 6, 15).toISOString(), 
    description: 'Salario Mensual', 
    amount: 3500, 
    type: 'income', 
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString(),
    category: mockCategoriesData.find(c => c.id === 'salary')
  },
  { 
    id: '2', 
    user_id: 'mock-user', 
    category_id: 'food', 
    transaction_date: new Date(2024, 6, 16).toISOString(), 
    description: 'Compras de la semana', 
    amount: 85.20, 
    type: 'expense', 
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString(),
    category: mockCategoriesData.find(c => c.id === 'food')
  },
  { 
    id: '3', 
    user_id: 'mock-user', 
    category_id: 'housing', 
    transaction_date: new Date(2024, 6, 17).toISOString(), 
    description: 'Alquiler del Apartamento', 
    amount: 1250, 
    type: 'expense', 
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString(),
    category: mockCategoriesData.find(c => c.id === 'housing')
  },
  { 
    id: '4', 
    user_id: 'mock-user', 
    category_id: 'utilities', 
    transaction_date: new Date(2024, 6, 18).toISOString(), 
    description: 'Factura de Electricidad', 
    amount: 65.00, 
    type: 'expense', 
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString(),
    category: mockCategoriesData.find(c => c.id === 'utilities')
  },
  { 
    id: '5', 
    user_id: 'mock-user', 
    category_id: 'entertainment', 
    transaction_date: new Date(2024, 6, 20).toISOString(), 
    description: 'Noche de Cine Fin de Semana', 
    amount: 45.75, 
    type: 'expense', 
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString(),
    category: mockCategoriesData.find(c => c.id === 'entertainment')
  },
  { 
    id: '6', 
    user_id: 'mock-user', 
    category_id: 'salary', 
    transaction_date: new Date(2024, 5, 15).toISOString(), 
    description: 'Salario Mes Anterior', 
    amount: 3500, 
    type: 'income', 
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString(),
    category: mockCategoriesData.find(c => c.id === 'salary')
  },
  { 
    id: '7', 
    user_id: 'mock-user', 
    category_id: 'entertainment', 
    transaction_date: new Date(2024, 5, 22).toISOString(), 
    description: 'Entradas Concierto', 
    amount: 150.00, 
    type: 'expense', 
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString(),
    category: mockCategoriesData.find(c => c.id === 'entertainment')
  },
  { 
    id: '8', 
    user_id: 'mock-user', 
    category_id: 'salary', 
    transaction_date: new Date(2024, 6, 1).toISOString(), 
    description: 'Pago Proyecto Freelance', 
    amount: 500, 
    type: 'income', 
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString(),
    category: mockCategoriesData.find(c => c.id === 'salary')
  },
  { 
    id: '9', 
    user_id: 'mock-user', 
    category_id: 'transport', 
    transaction_date: new Date(2024, 6, 5).toISOString(), 
    description: 'Abono Transporte', 
    amount: 55, 
    type: 'expense', 
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString(),
    category: mockCategoriesData.find(c => c.id === 'transport')
  },
  { 
    id: '10', 
    user_id: 'mock-user', 
    category_id: 'healthcare', 
    transaction_date: new Date(2024, 6, 10).toISOString(), 
    description: 'Copago Visita Médica', 
    amount: 25, 
    type: 'expense', 
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString(),
    category: mockCategoriesData.find(c => c.id === 'healthcare')
  },
  { 
    id: '11', 
    user_id: 'mock-user', 
    category_id: 'salary', 
    transaction_date: new Date(2024, 4, 15).toISOString(), 
    description: 'Salario (Abril)', 
    amount: 3400, 
    type: 'income', 
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString(),
    category: mockCategoriesData.find(c => c.id === 'salary')
  },
  { 
    id: '12', 
    user_id: 'mock-user', 
    category_id: 'gifts', 
    transaction_date: new Date(2024, 4, 20).toISOString(), 
    description: 'Regalo Cumpleaños Amigo', 
    amount: 50, 
    type: 'expense', 
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString(),
    category: mockCategoriesData.find(c => c.id === 'gifts')
  },
];

// Usuario mock para pruebas
export const mockUser = {
  id: 'mock-user',
  name: 'Usuario de Prueba',
  email: 'test@test.com',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Credenciales de prueba
export const mockCredentials = {
  email: 'test@test.com',
  password: 'test123'
};

// Respuesta mock para autenticación
export const mockAuthResponse = {
  user: mockUser,
  access_token: 'mock-jwt-token-' + Date.now(),
  refresh_token: 'mock-refresh-token-' + Date.now()
};

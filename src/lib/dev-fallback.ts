/**
 * Funciones de fallback para desarrollo cuando el backend no está disponible
 */

// Usuario mock para pruebas
const mockDevUser: User = {
  id: 'mock-user',
  auth_id: 'mock-auth-id',
  email: 'test@test.com',
  username: 'testuser',
  display_name: 'Usuario de Prueba',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Credenciales de prueba
const mockDevCredentials = {
  email: 'test@test.com',
  password: 'test123'
};

// Respuesta mock para autenticación
const mockDevAuthResponse: AuthResponse = {
  user: mockDevUser,
  access_token: 'mock-jwt-token-' + Date.now(),
  refresh_token: 'mock-refresh-token-' + Date.now()
};
import { LoginForm, RegisterForm, AuthResponse, User } from '../types';

export class DevFallbackService {
  private static readonly STORAGE_KEY = 'dev-fallback-enabled';
  
  /**
   * Verificar si el modo fallback está habilitado
   */
  static isEnabled(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(this.STORAGE_KEY) === 'true';
  }
  
  /**
   * Habilitar modo fallback
   */
  static enable(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, 'true');
      console.warn('🔧 Modo de desarrollo habilitado - usando datos mock');
    }
  }
  
  /**
   * Deshabilitar modo fallback
   */
  static disable(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('✅ Modo de desarrollo deshabilitado - usando backend real');
    }
  }
  
  /**
   * Login mock para desarrollo
   */
  static async mockLogin(data: LoginForm): Promise<AuthResponse> {
    await this.delay(1000); // Simular latencia de red
    
    if (data.email === mockDevCredentials.email && data.password === mockDevCredentials.password) {
      return mockDevAuthResponse;
    }
    
    throw new Error('Credenciales incorrectas (usa test@test.com / test123)');
  }
  
  /**
   * Registro mock para desarrollo
   */
  static async mockRegister(data: RegisterForm): Promise<AuthResponse> {
    await this.delay(1000);
    
    // Crear usuario mock con los datos proporcionados
    const newUser: User = {
      id: 'mock-user-' + Date.now(),
      auth_id: 'mock-auth-' + Date.now(),
      email: data.email,
      username: data.username,
      display_name: data.display_name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return {
      user: newUser,
      access_token: 'mock-jwt-token-' + Date.now(),
      refresh_token: 'mock-refresh-token-' + Date.now()
    };
  }
  
  /**
   * Verificar token mock
   */
  static async mockVerifyToken(): Promise<User> {
    await this.delay(500);
    return mockDevUser;
  }
  
  /**
   * Simular delay de red
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Mostrar mensaje de ayuda para el modo fallback
   */
  static showHelp(): void {
    console.group('🔧 Modo de Desarrollo - Datos Mock');
    console.log('Credenciales de prueba:');
    console.log('Email: test@test.com');
    console.log('Password: test123');
    console.log('');
    console.log('Para habilitar: DevFallbackService.enable()');
    console.log('Para deshabilitar: DevFallbackService.disable()');
    console.groupEnd();
  }
}

// Auto-habilitar en desarrollo si el backend no responde
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).DevFallbackService = DevFallbackService;
  DevFallbackService.showHelp();
}

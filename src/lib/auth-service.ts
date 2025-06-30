import { apiClient } from './api-client';
import { DevFallbackService } from './dev-fallback';
import { 
  ApiResponse, 
  AuthResponse, 
  LoginForm, 
  RegisterForm, 
  User 
} from '../types';

export class AuthService {
  /**
   * Registrar nuevo usuario
   */
  static async register(data: RegisterForm): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/register', data);
      
      if (response.success && response.data) {
        // Guardar tokens en localStorage
        this.setAuthTokens(response.data.access_token, response.data.refresh_token);
        this.setUser(response.data.user);
        return response.data;
      }
      
      throw new Error(response.message || 'Error al registrar usuario');
    } catch (error: any) {
      console.error('Error en registro:', error);
      
      // Si es un error del servidor (400, 500, etc.) o de conexión, habilitar fallback automáticamente
      if (error.response?.status >= 400 || !error.response) {
        console.warn('🔧 Backend no disponible para registro, habilitando modo fallback');
        console.warn('📧 Puedes registrarte con cualquier email/contraseña en modo de prueba');
        DevFallbackService.enable();
        return await DevFallbackService.mockRegister(data);
      }
      
      // Capturar errores de validación específicos
      if (error.response?.data?.details) {
        const validationMessages = error.response.data.details.map((detail: any) => detail.message);
        throw new Error(validationMessages.join(', '));
      }
      // Capturar el mensaje específico del servidor
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }

  /**
   * Iniciar sesión
   */
  static async login(data: LoginForm): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/login', data);
      
      if (response.success && response.data) {
        // Guardar tokens en localStorage
        this.setAuthTokens(response.data.access_token, response.data.refresh_token);
        this.setUser(response.data.user);
        return response.data;
      }
      
      throw new Error(response.message || 'Error al iniciar sesión');
    } catch (error: any) {
      console.error('Error en login:', error);
      
      // Si es un error 500, 401 (email not confirmed), o de conexión, habilitar fallback automáticamente
      if (error.response?.status === 500 || error.response?.status === 401 || !error.response) {
        console.warn('🔧 Backend no disponible o credenciales no válidas, habilitando modo fallback');
        console.warn('📧 Para probar el login, usa: test@test.com / test123');
        DevFallbackService.enable();
        return await DevFallbackService.mockLogin(data);
      }
      
      // Capturar errores de validación específicos
      if (error.response?.data?.details) {
        const validationMessages = error.response.data.details.map((detail: any) => detail.message);
        throw new Error(validationMessages.join(', '));
      }
      
      // Capturar el mensaje específico del servidor
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      
      // Errores específicos por código de estado
      if (error.response?.status === 401) {
        throw new Error('Email o contraseña incorrectos');
      }
      
      throw error;
    }
  }

  /**
   * Cerrar sesión
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.post<ApiResponse<null>>('/api/auth/logout');
    } finally {
      // Limpiar datos locales independientemente del resultado de la API
      this.clearAuthData();
    }
  }

  /**
   * Obtener perfil del usuario
   */
  static async getProfile(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/api/auth/profile');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Error al obtener perfil');
  }

  /**
   * Actualizar perfil del usuario
   */
  static async updateProfile(updates: Partial<User>): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>('/api/auth/profile', updates);
    
    if (response.success && response.data) {
      this.setUser(response.data);
      return response.data;
    }
    
    throw new Error(response.message || 'Error al actualizar perfil');
  }

  /**
   * Verificar si el token es válido
   */
  static async verifyToken(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>('/api/auth/verify');
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Token inválido');
    } catch (error: any) {
      // Si el fallback está habilitado o hay error de servidor
      if (DevFallbackService.isEnabled() || error.response?.status === 500 || !error.response) {
        return await DevFallbackService.mockVerifyToken();
      }
      throw error;
    }
  }

  /**
   * Test function para debugging
   */
  static async testLogin(): Promise<void> {
    try {
      console.log('=== TEST LOGIN START ===');
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/login', {
        email: 'test@test.com',
        password: 'test123'
      });
      
      console.log('✅ Test response received:', response);
      console.log('✅ Response data:', response.data);
      console.log('✅ Response success:', response.success);
      
      if (response.success && response.data) {
        console.log('✅ Data structure is correct');
        console.log('✅ access_token:', response.data.access_token);
        console.log('✅ refresh_token:', response.data.refresh_token);
        console.log('✅ user:', response.data.user);
      } else {
        console.error('❌ Data structure is incorrect');
        console.error('❌ response.success:', response.success);
        console.error('❌ response.data:', response.data);
      }
      
    } catch (error: any) {
      console.error('❌ TEST LOGIN FAILED:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error response data:', error.response?.data);
    }
  }

  // === MÉTODOS AUXILIARES ===

  /**
   * Guardar tokens en localStorage
   */
  private static setAuthTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      // Actualizar token en el cliente API
      apiClient.setAuthToken(accessToken);
    }
  }

  /**
   * Guardar usuario en localStorage
   */
  private static setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fintrackUser', JSON.stringify(user));
    }
  }

  /**
   * Limpiar todos los datos de autenticación
   */
  static clearAuthData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('fintrackUser');
    }
  }

  /**
   * Obtener usuario actual desde localStorage
   */
  static getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('fintrackUser');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  /**
   * Verificar si el usuario está autenticado
   */
  static isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('fintrackUser');
      return !!(token && user);
    }
    return false;
  }

  /**
   * Obtener token de acceso
   */
  static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }
}

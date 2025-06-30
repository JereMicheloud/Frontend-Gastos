'use client';

import { AuthService } from '@/lib/auth-service';

export default function TestPage() {
  const handleTestLogin = async () => {
    try {
      await AuthService.testLogin();
    } catch (error) {
      console.error('Test failed:', error);
    }
  };

  const handleRealLogin = async () => {
    try {
      await AuthService.login({
        email: 'test@example.com',
        password: 'password123'
      });
    } catch (error) {
      console.error('Real login failed:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Login Test Page</h1>
      
      <div className="space-y-4">
        <button 
          onClick={handleTestLogin}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Login (Mock Endpoint)
        </button>
        
        <button 
          onClick={handleRealLogin}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Real Login
        </button>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        Open browser developer tools to see the console logs
      </div>
    </div>
  );
}

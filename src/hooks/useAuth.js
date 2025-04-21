import { useAuth as useAuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const {
    currentUser,
    register,
    login,
    logout,
    loading,
    error
  } = useAuthContext();

  return {
    // Auth state
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    error,

    // Auth methods
    register: async (email, password) => {
      try {
        return await register(email, password);
      } catch (error) {
        console.error('Registration error:', error);
        throw error;
      }
    },

    login: async (email, password) => {
      try {
        return await login(email, password);
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },

    logout: async () => {
      try {
        await logout();
      } catch (error) {
        console.error('Logout error:', error);
        throw error;
      }
    }
  };
}; 
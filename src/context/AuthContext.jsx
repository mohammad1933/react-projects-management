    import { createContext, useContext, useState, useEffect } from 'react';
    import { authService } from '../api/authService';

    // Create the context object
    const AuthContext = createContext(null);

    // This wraps our whole app and provides auth state everywhere
    export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // true while we check localStorage

    // On app load, restore user from localStorage if available
    useEffect(() => {
     const savedUser  = localStorage.getItem('auth_user');
  const savedToken = localStorage.getItem('auth_token');
  // console.log('restoring from storage:', savedUser); // 👈

  if (savedUser && savedToken) {
    setUser(JSON.parse(savedUser));
  }
  setLoading(false);
    }, []);

    // Save token + user to state and localStorage
    const saveAuth = (token, userData) => {
        //  console.log('saveAuth called with:', token, userData); // 👈
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    setUser(userData);
    };

    // Clear everything on logout
    const clearAuth = async () => {
    try {
    await authService.logout();
    } catch {
    // Even if API call fails, clear local storage
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);
    };

    return (
    <AuthContext.Provider value={{ user, setUser, saveAuth, clearAuth, loading }}>
        {children}
    </AuthContext.Provider>
    );
    }

    // Custom hook — makes consuming auth easy: const { user } = useAuth();
    export const useAuth = () => useContext(AuthContext);

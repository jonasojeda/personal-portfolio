import { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    try {
      setError(null);
      // Change this URL if your Laravel API is hosted on a different port/domain
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email,
        password
      });

      if (response.data && response.data.accessToken) {
        const userData = response.data.user;
        const accessToken = response.data.accessToken;

        setUser(userData);
        setToken(accessToken);
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', accessToken);
        return true;
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || 'Error during login');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, error, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

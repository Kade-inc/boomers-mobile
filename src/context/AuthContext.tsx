import React, { createContext, useContext, useEffect, useState } from 'react';
import { checkAuthStatus, userService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '@/entities/User';

interface AuthContextType {
  isAuthenticated: boolean | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  fetchUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  const fetchUserProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const response = await userService.getUserProfile(userId);

      if (response.success && response.data) {
        console.log("WONDER: ", response.data);
        console.log("GOT: ", response.data);
        setUser(response.data);
        await AsyncStorage.setItem('userProfile', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const checkAuth = async () => {
    try {
      const isValid = await checkAuthStatus();
      setIsAuthenticated(isValid);
      
      if (isValid) {
        // Try to get user profile from AsyncStorage first
        const storedProfile = await AsyncStorage.getItem('userProfile');
        if (storedProfile) {
          setUser(JSON.parse(storedProfile));
        }
        // Then fetch fresh data
        await fetchUserProfile();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('userProfile');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      signOut, 
      checkAuth, 
      user,
      setUser,
      fetchUserProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
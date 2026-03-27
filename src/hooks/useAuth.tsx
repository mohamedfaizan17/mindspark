import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { signUp as authSignUp, signIn as authSignIn, getCurrentUser, User } from '@/lib/auth-client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('auth_token');
    if (token) {
      getCurrentUser(token).then((user) => {
        setUser(user);
        setLoading(false);
      }).catch(() => {
        localStorage.removeItem('auth_token');
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      const result = await authSignUp(email, password, firstName, lastName);
      
      if (result.error) {
        return { error: result.error };
      }

      if (result.user && result.token) {
        localStorage.setItem('auth_token', result.token);
        setUser(result.user);
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authSignIn(email, password);
      
      if (result.error) {
        return { error: result.error };
      }

      if (result.user && result.token) {
        localStorage.setItem('auth_token', result.token);
        setUser(result.user);
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    try {
      // Clear auth token
      localStorage.removeItem('auth_token');
      
      // Clear all user-specific data to ensure clean logout
      if (user) {
        const assessmentKey = `assessment_${user.id}`;
        const resumeKey = `resume_analysis_${user.id}`;
        
        console.log('Clearing user data on logout:', { assessmentKey, resumeKey });
        localStorage.removeItem(assessmentKey);
        localStorage.removeItem(resumeKey);
      }
      
      // Clear any other user-specific keys that might exist
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('assessment_') || key.startsWith('resume_analysis_'))) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        console.log('Removing localStorage key:', key);
        localStorage.removeItem(key);
      });
      
      setUser(null);
      console.log('User signed out and data cleared');
      return {};
    } catch (error) {
      console.error('Error during sign out:', error);
      return { error: 'Failed to sign out' };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, RegistrationKey } from '../types'; // Ensure RegistrationKey is imported
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  registrationKeys: RegistrationKey[];
  isLoading: boolean;
  login: (username: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, password?: string, registrationKeyValue?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  generateRegistrationKey: () => Promise<RegistrationKey | null>;
  grantAdminRole: (userId: string) => Promise<void>;
  revokeAdminRole: (userId: string) => Promise<void>;
  banUser: (userId: string) => Promise<void>;
  unbanUser: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Mock Data Storage ---
// In a real app, this would be a backend API.
// For simplicity, we'll use localStorage and initialize with some data.

const USERS_STORAGE_KEY = 'roblox_clicker_users';
const KEYS_STORAGE_KEY = 'roblox_clicker_reg_keys';
const CURRENT_USER_STORAGE_KEY = 'roblox_clicker_current_user';

const initialAdminUser: User = {
  id: 'admin-gwjsvzv',
  username: 'gwjsvzv',
  password: 'Denis12889!', // Storing plain text for mock. NEVER do this in production.
  roles: ['user', 'admin'],
  joinDate: new Date().toISOString(),
  status: 'Active',
};

const getInitialUsers = (): User[] => {
  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
  if (storedUsers) {
    return JSON.parse(storedUsers);
  }
  // Ensure admin user is always present if no users are stored
  return [initialAdminUser];
};

const getInitialKeys = (): RegistrationKey[] => {
  const storedKeys = localStorage.getItem(KEYS_STORAGE_KEY);
  return storedKeys ? JSON.parse(storedKeys) : [];
};

const getInitialCurrentUser = (): User | null => {
  const storedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
  return storedUser ? JSON.parse(storedUser) : null;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(getInitialCurrentUser());
  const [users, setUsers] = useState<User[]>(getInitialUsers());
  const [registrationKeys, setRegistrationKeys] = useState<RegistrationKey[]>(getInitialKeys());
  const [isLoading, setIsLoading] = useState<boolean>(true); // True initially until checked

  useEffect(() => {
    // Initial load check
    const user = getInitialCurrentUser();
    if (user) {
        // Re-validate user against the full user list (e.g., if roles changed elsewhere)
        const validatedUser = users.find(u => u.id === user.id);
        if (validatedUser) {
            setCurrentUser(validatedUser);
        } else {
            localStorage.removeItem(CURRENT_USER_STORAGE_KEY); // Stale user
            setCurrentUser(null);
        }
    }
    setIsLoading(false);
  }, [users]); // Rerun if users list changes (e.g. roles updated)

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(KEYS_STORAGE_KEY, JSON.stringify(registrationKeys));
  }, [registrationKeys]);
  
  useEffect(() => {
    if (currentUser) {
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  }, [currentUser]);


  const login = async (username: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = users.find(u => u.username === username);

    if (user && user.password === password) { // Plain text compare for mock
      if (user.status === 'Banned') {
        setIsLoading(false);
        return { success: false, message: 'This account is banned.' };
      }
      setCurrentUser(user);
      setIsLoading(false);
      return { success: true };
    }
    setIsLoading(false);
    return { success: false, message: 'Invalid username or password.' };
  };

  const register = async (username: string, password?: string, registrationKeyValue?: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!registrationKeyValue) {
        setIsLoading(false);
        return { success: false, message: 'Registration key is required.' };
    }
    if (!password) {
        setIsLoading(false);
        return { success: false, message: 'Password is required.' };
    }

    const keyIndex = registrationKeys.findIndex(k => k.value === registrationKeyValue && !k.isUsed);
    if (keyIndex === -1) {
      setIsLoading(false);
      return { success: false, message: 'Invalid or used registration key.' };
    }

    if (users.find(u => u.username === username)) {
      setIsLoading(false);
      return { success: false, message: 'Username already taken.' };
    }

    const newUser: User = {
      id: uuidv4(),
      username,
      password, // Store plain text for mock
      roles: ['user'],
      joinDate: new Date().toISOString(),
      status: 'Active',
    };
    
    setUsers(prevUsers => [...prevUsers, newUser]);
    
    const updatedKeys = [...registrationKeys];
    updatedKeys[keyIndex] = { ...updatedKeys[keyIndex], isUsed: true, usedBy: newUser.id };
    setRegistrationKeys(updatedKeys);
    
    setCurrentUser(newUser); // Auto-login after registration
    setIsLoading(false);
    return { success: true };
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    setCurrentUser(null);
    setIsLoading(false);
  };

  const generateRegistrationKey = async (): Promise<RegistrationKey | null> => {
    if (!currentUser || !currentUser.roles.includes('admin')) {
      console.error("Unauthorized attempt to generate key.");
      return null;
    }
    const newKeyValue = `ROBLOXCLICKER-${uuidv4().substring(0, 8).toUpperCase()}`;
    const newKey: RegistrationKey = {
      id: uuidv4(),
      value: newKeyValue,
      isUsed: false,
      generatedBy: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    setRegistrationKeys(prevKeys => [...prevKeys, newKey]);
    return newKey;
  };

  const updateUserRoles = async (userId: string, newRoles: Array<'user' | 'admin'>) => {
    setUsers(prevUsers => 
      prevUsers.map(u => u.id === userId ? { ...u, roles: newRoles } : u)
    );
     // If current user's roles changed, update currentUser state
    if (currentUser?.id === userId) {
        setCurrentUser(prev => prev ? {...prev, roles: newRoles} : null);
    }
  };

  const grantAdminRole = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user && !user.roles.includes('admin')) {
      await updateUserRoles(userId, [...user.roles, 'admin']);
    }
  };

  const revokeAdminRole = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      await updateUserRoles(userId, ['user']); // All users are at least 'user'
    }
  };

  const updateUserStatus = async (userId: string, status: 'Active' | 'Banned') => {
    setUsers(prevUsers => 
      prevUsers.map(u => u.id === userId ? { ...u, status } : u)
    );
    // If current user is banned, log them out
    if (currentUser?.id === userId && status === 'Banned') {
        await logout();
    }
  };
  
  const banUser = async (userId: string) => {
    await updateUserStatus(userId, 'Banned');
  };

  const unbanUser = async (userId: string) => {
    await updateUserStatus(userId, 'Active');
  };


  return (
    <AuthContext.Provider value={{ 
        currentUser, 
        users, 
        registrationKeys, 
        isLoading, 
        login, 
        register, 
        logout, 
        generateRegistrationKey, 
        grantAdminRole, 
        revokeAdminRole,
        banUser,
        unbanUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

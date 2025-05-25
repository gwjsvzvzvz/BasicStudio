
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, UserRole, RegistrationKey, Post, PostCategory } from './types';

const ADMIN_USERNAME = 'gwjsvzv';
// "Denis12889!" -> btoa("Denis12889!") -> "RGVuaXMxMjg4OSE="
const ADMIN_PASSWORD_HASH = 'RGVuaXMxMjg4OSE=';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  posts: Post[];
  keys: RegistrationKey[];
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string, registrationKey: string) => Promise<boolean>;
  logout: () => void;
  addPost: (title: string, content: string, category: PostCategory) => Promise<boolean>;
  generateKey: () => Promise<RegistrationKey | null>;
  getPostsByCategory: (category: PostCategory) => Post[];
  changeUserRole: (userId: string, newRole: UserRole) => Promise<boolean>;
  deletePost: (postId: string) => Promise<boolean>;
  deleteKey: (keyId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [keys, setKeys] = useState<RegistrationKey[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const simpleHash = (password: string): string => btoa(password);

  useEffect(() => {
    setIsLoading(true);
    const storedUsers = localStorage.getItem('forum_users');
    const storedPosts = localStorage.getItem('forum_posts');
    const storedKeys = localStorage.getItem('forum_keys');
    const storedCurrentUser = localStorage.getItem('forum_currentUser');

    let loadedUsers: User[] = storedUsers ? JSON.parse(storedUsers) : [];
    if (loadedUsers.length === 0 || !loadedUsers.find(u => u.username === ADMIN_USERNAME)) {
      const adminUser: User = {
        id: 'admin_user_001',
        username: ADMIN_USERNAME,
        passwordHash: ADMIN_PASSWORD_HASH,
        role: UserRole.ADMIN,
      };
      loadedUsers = loadedUsers.filter(u => u.username !== ADMIN_USERNAME); // remove if exists with wrong pass or role
      loadedUsers.push(adminUser);
    }
    
    setUsers(loadedUsers);
    setPosts(storedPosts ? JSON.parse(storedPosts) : []);
    setKeys(storedKeys ? JSON.parse(storedKeys) : []);
    
    if (storedCurrentUser) {
        const foundUser = loadedUsers.find(u => u.id === JSON.parse(storedCurrentUser).id);
        setCurrentUser(foundUser || null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if(!isLoading) { // Only save after initial load
        localStorage.setItem('forum_users', JSON.stringify(users));
    }
  }, [users, isLoading]);

  useEffect(() => {
    if(!isLoading) {
        localStorage.setItem('forum_posts', JSON.stringify(posts));
    }
  }, [posts, isLoading]);

  useEffect(() => {
    if(!isLoading) {
        localStorage.setItem('forum_keys', JSON.stringify(keys));
    }
  }, [keys, isLoading]);

  useEffect(() => {
    if(!isLoading) {
        localStorage.setItem('forum_currentUser', JSON.stringify(currentUser));
    }
  }, [currentUser, isLoading]);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    const user = users.find(u => u.username === username);
    if (user && user.passwordHash === simpleHash(password)) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, [users]);

  const signup = useCallback(async (username: string, password: string, registrationKeyValue: string): Promise<boolean> => {
    if (users.find(u => u.username === username)) {
      alert('Username already exists.');
      return false;
    }
    const keyIndex = keys.findIndex(k => k.key === registrationKeyValue && !k.isUsed);
    if (keyIndex === -1) {
      alert('Invalid or used registration key.');
      return false;
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      username,
      passwordHash: simpleHash(password),
      role: UserRole.USER,
      registrationKey: registrationKeyValue,
    };
    setUsers(prevUsers => [...prevUsers, newUser]);
    
    const updatedKeys = [...keys];
    updatedKeys[keyIndex] = { ...updatedKeys[keyIndex], isUsed: true, usedBy: username };
    setKeys(updatedKeys);
    
    setCurrentUser(newUser);
    return true;
  }, [users, keys]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const addPost = useCallback(async (title: string, content: string, category: PostCategory): Promise<boolean> => {
    if (!currentUser) {
      alert('You must be logged in to post.');
      return false;
    }
    if (category === PostCategory.ANNOUNCEMENT && currentUser.role !== UserRole.ADMIN) {
      alert('Only admins can post announcements.');
      return false;
    }

    const newPost: Post = {
      id: `post_${Date.now()}`,
      title,
      content,
      authorId: currentUser.id,
      authorUsername: currentUser.username,
      category,
      createdAt: new Date().toISOString(),
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
    return true;
  }, [currentUser]);

  const generateKey = useCallback(async (): Promise<RegistrationKey | null> => {
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      alert('Only admins can generate keys.');
      return null;
    }
    const newKey: RegistrationKey = {
      id: `key_${Date.now()}`,
      key: `REG-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      isUsed: false,
      generatedBy: currentUser.username,
      createdAt: new Date().toISOString(),
    };
    setKeys(prevKeys => [newKey, ...prevKeys]);
    return newKey;
  }, [currentUser]);

  const getPostsByCategory = useCallback((category: PostCategory): Post[] => {
    return posts.filter(p => p.category === category).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [posts]);

  const changeUserRole = useCallback(async (userId: string, newRole: UserRole): Promise<boolean> => {
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
        alert('Only admins can change user roles.');
        return false;
    }
    if (userId === currentUser.id && newRole !== UserRole.ADMIN) {
        alert('Admin cannot demote themselves.');
        return false;
    }
    setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, role: newRole } : u));
    if (currentUser.id === userId) { // If admin changes their own role (e.g. to VIP then back to ADMIN, although UI should prevent demotion)
        const updatedSelf = users.find(u => u.id === userId);
        if (updatedSelf) setCurrentUser({...updatedSelf, role: newRole});
    }
    return true;
  }, [currentUser, users]);
  
  const deletePost = useCallback(async (postId: string): Promise<boolean> => {
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
        alert('Only admins can delete posts.'); // Or allow users to delete their own posts
        return false;
    }
    setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
    return true;
  }, [currentUser]);

  const deleteKey = useCallback(async (keyId: string): Promise<boolean> => {
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
        alert('Only admins can delete keys.');
        return false;
    }
    setKeys(prevKeys => prevKeys.filter(k => k.id !== keyId));
    return true;
  }, [currentUser]);


  return (
    <AuthContext.Provider value={{ currentUser, users, posts, keys, isLoading, login, signup, logout, addPost, generateKey, getPostsByCategory, changeUserRole, deletePost, deleteKey }}>
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

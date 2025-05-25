
import React, { useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Post, PostCategory, UserRole, RegistrationKey, User } from './types';

// --- UI Primitives ---

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', isLoading = false, className = '', ...props }) => {
  const baseStyle = 'font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 flex items-center justify-center';
  
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-textPrimary hover:bg-surface focus:ring-primary',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`} {...props} disabled={props.disabled || isLoading}>
      {isLoading ? <LoadingSpinner size="sm" /> : children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, className = '', ...props }) => {
  return (
    <div>
      {label && <label htmlFor={id} className="block text-sm font-medium text-textSecondary mb-1">{label}</label>}
      <input id={id} className={`w-full px-3 py-2 bg-surface border border-borderLight rounded-md shadow-sm focus:ring-primary focus:border-primary text-textPrimary placeholder-gray-500 ${className}`} {...props} />
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}
export const Textarea: React.FC<TextareaProps> = ({ label, id, className = '', ...props }) => {
  return (
    <div>
      {label && <label htmlFor={id} className="block text-sm font-medium text-textSecondary mb-1">{label}</label>}
      <textarea id={id} className={`w-full px-3 py-2 bg-surface border border-borderLight rounded-md shadow-sm focus:ring-primary focus:border-primary text-textPrimary placeholder-gray-500 ${className}`} {...props} />
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300 ease-in-out">
      <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow">
        <div className="flex justify-between items-center mb-4">
          {title && <h3 className="text-xl font-semibold text-textPrimary">{title}</h3>}
          <button onClick={onClose} className="text-textSecondary hover:text-textPrimary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
      <style>{`
        @keyframes modalShow {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modalShow {
          animation: modalShow 0.3s forwards;
        }
      `}</style>
    </div>
  );
};

export const LoadingSpinner: React.FC<{size?: 'sm' | 'md' | 'lg', className?: string}> = ({ size = 'md', className }) => {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-4',
        lg: 'w-12 h-12 border-[6px]',
    };
    return (
        <div className={`inline-block animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${sizeClasses[size]} ${className}`} role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
    );
};

// --- App Specific Components ---

interface AuthFormProps {
  isLoginMode: boolean;
  onSwitchMode: () => void;
  onSuccess: () => void;
}
export const AuthForm: React.FC<AuthFormProps> = ({ isLoginMode, onSwitchMode, onSuccess }) => {
  const { login, signup } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registrationKey, setRegistrationKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    let success = false;
    try {
      if (isLoginMode) {
        success = await login(username, password);
        if (!success) setError('Invalid username or password.');
      } else {
        if (!registrationKey) {
          setError('Registration key is required.');
          setIsLoading(false);
          return;
        }
        success = await signup(username, password, registrationKey);
        if (!success) setError('Signup failed. Key might be invalid or username taken.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    }
    setIsLoading(false);
    if (success) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Input type="text" label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <Input type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      {!isLoginMode && (
        <Input type="text" label="Registration Key" value={registrationKey} onChange={(e) => setRegistrationKey(e.target.value)} required />
      )}
      <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
        {isLoginMode ? 'Login' : 'Sign Up'}
      </Button>
      <Button type="button" variant="ghost" onClick={onSwitchMode} className="w-full text-sm">
        {isLoginMode ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
      </Button>
    </form>
  );
};

interface PostCardProps {
  post: Post;
}
export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { currentUser, deletePost } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if(window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
      setIsDeleting(true);
      await deletePost(post.id);
      setIsDeleting(false); // No need to reset as component might unmount
    }
  };

  return (
    <div className="bg-surface p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl sm:text-2xl font-semibold text-primary mb-2">{post.title}</h3>
      <p className="text-textSecondary text-xs sm:text-sm mb-1">By: {post.authorUsername} | Category: {post.category}</p>
      <p className="text-textSecondary text-xs sm:text-sm mb-3">Posted: {new Date(post.createdAt).toLocaleDateString()}</p>
      <p className="text-textPrimary whitespace-pre-wrap break-words mb-4">{post.content.substring(0, 200)}{post.content.length > 200 ? '...' : ''}</p>
      {currentUser?.role === UserRole.ADMIN && (
        <Button onClick={handleDelete} variant="danger" size="sm" isLoading={isDeleting}>Delete</Button>
      )}
    </div>
  );
};

interface PostFormProps {
  category: PostCategory;
  onPostSuccess: () => void;
}
export const PostForm: React.FC<PostFormProps> = ({ category, onPostSuccess }) => {
  const { addPost, currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError('');
    const success = await addPost(title, content, category);
    setIsLoading(false);
    if (success) {
      setTitle('');
      setContent('');
      onPostSuccess();
    } else {
      setError(`Failed to create ${category.toLowerCase()}. Ensure you have permissions.`);
    }
  };
  
  if (category === PostCategory.ANNOUNCEMENT && currentUser?.role !== UserRole.ADMIN) return null;
  if (!currentUser) return <p className="text-textSecondary">Please login to post.</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-surface p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-textPrimary mb-4">Create New {category.charAt(0) + category.slice(1).toLowerCase()}</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Input type="text" label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Textarea label="Content" value={content} onChange={(e) => setContent(e.target.value)} rows={5} required />
      <Button type="submit" variant="primary" isLoading={isLoading}>Submit Post</Button>
    </form>
  );
};


interface AdminPanelContentProps {}
export const AdminPanelContent: React.FC<AdminPanelContentProps> = () => {
  const { currentUser, users, keys, generateKey, changeUserRole, deleteKey } = useAuth();
  const [newKey, setNewKey] = useState<RegistrationKey | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (currentUser?.role !== UserRole.ADMIN) {
    return <p>Access Denied. Admins only.</p>;
  }

  const handleGenerateKey = async () => {
    setIsGenerating(true);
    const key = await generateKey();
    setNewKey(key);
    setIsGenerating(false);
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (window.confirm(`Change user role to ${newRole}?`)) {
        await changeUserRole(userId, newRole);
    }
  };
  
  const handleDeleteKey = async (keyId: string) => {
    if (window.confirm(`Delete this key? This action cannot be undone.`)) {
        await deleteKey(keyId);
    }
  };

  return (
    <div className="space-y-8">
      <section className="bg-surface p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-primary">Generate Registration Key</h3>
        <Button onClick={handleGenerateKey} isLoading={isGenerating}>Generate New Key</Button>
        {newKey && (
          <div className="mt-4 p-3 bg-background rounded select-all">
            <p className="text-textPrimary">New Key: <strong className="text-secondary">{newKey.key}</strong> (Valid until used)</p>
          </div>
        )}
      </section>

      <section className="bg-surface p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-primary">Manage Users</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-borderLight">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Username</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Role</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-borderLight">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-textPrimary">{user.username}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-textPrimary">{user.role}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    {user.id !== currentUser.id && (
                      <select 
                        value={user.role} 
                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                        className="bg-gray-700 text-textPrimary p-1 rounded border border-borderLight focus:ring-primary focus:border-primary text-xs"
                        >
                        {Object.values(UserRole).map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      
      <section className="bg-surface p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-primary">Manage Registration Keys</h3>
         <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-borderLight">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Key</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Used By</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-borderLight">
              {keys.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(k => (
                <tr key={k.id}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-textPrimary font-mono">{k.key}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${k.isUsed ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                      {k.isUsed ? 'Used' : 'Available'}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-textPrimary">{k.usedBy || 'N/A'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                     {!k.isUsed && <Button onClick={() => handleDeleteKey(k.id)} variant="danger" size="sm">Delete</Button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

interface VipLoungeContentProps {}
export const VipLoungeContent: React.FC<VipLoungeContentProps> = () => {
  const { currentUser } = useAuth();

  if (currentUser?.role !== UserRole.VIP && currentUser?.role !== UserRole.ADMIN) {
    return <p>This area is for VIP members and Admins only.</p>;
  }

  return (
    <div className="bg-surface p-6 rounded-lg shadow-md text-center">
      <h2 className="text-3xl font-bold text-secondary mb-4">Welcome to the VIP Lounge!</h2>
      <p className="text-textPrimary text-lg mb-2">Hello, {currentUser?.username}! You have exclusive access here.</p>
      <p className="text-textSecondary">More VIP perks and content coming soon!</p>
      <div className="mt-6">
        <img src="https://picsum.photos/seed/vip_lounge/600/300" alt="VIP Lounge" className="rounded-lg shadow-lg mx-auto"/>
      </div>
       {/* The "generate 3 invites" feature is complex for frontend-only. This is a placeholder.
           In a real app, this might involve specific key generation for VIPs or other benefits.
           For now, it's just a status and access to this page.
       */}
       <p className="text-textSecondary mt-4 text-sm">As a VIP, you enjoy special privileges. The "3 invites" mentioned are a conceptual perk for now.</p>
    </div>
  );
};


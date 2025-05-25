
import React, { useState, ReactNode, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { UserRole, PostCategory, NavLinkItem } from './types';
import { Button, Modal, AuthForm, PostCard, PostForm, AdminPanelContent, VipLoungeContent, LoadingSpinner } from './components';

// --- Navbar Component ---
const Navbar: React.FC<{ onAuthClick: () => void }> = ({ onAuthClick }) => {
  const { currentUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks: NavLinkItem[] = [
    { path: '/', label: 'Home' },
    { path: '/announcements', label: 'Announcements' },
    { path: '/scripts', label: 'Scripts' },
    { path: '/models', label: 'Models' },
    { path: '/vip-area', label: 'VIP Lounge', roles: [UserRole.VIP, UserRole.ADMIN] },
    { path: '/admin', label: 'Admin Panel', roles: [UserRole.ADMIN] },
  ];

  const filteredNavLinks = navLinks.filter(link => 
    !link.roles || (currentUser && link.roles.includes(currentUser.role))
  );

  return (
    <nav className="bg-surface shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 text-2xl font-bold text-primary hover:text-primary-light transition-colors">
              RobloxForum
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {filteredNavLinks.map((link) => (
                  <NavLink key={link.path} to={link.path}>
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <span className="text-textSecondary text-sm">Hi, {currentUser.username} ({currentUser.role})</span>
                <Button onClick={logout} variant="secondary" size="sm">Logout</Button>
              </div>
            ) : (
              <Button onClick={onAuthClick} variant="primary" size="sm">Login / Sign Up</Button>
            )}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="bg-surface inline-flex items-center justify-center p-2 rounded-md text-textSecondary hover:text-textPrimary hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {filteredNavLinks.map((link) => (
              <NavLink key={link.path} to={link.path} isMobile={true} onClick={() => setIsMobileMenuOpen(false)}>
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-borderLight">
            {currentUser ? (
              <div className="flex flex-col items-start px-5 space-y-2">
                <span className="text-textSecondary text-sm">Hi, {currentUser.username} ({currentUser.role})</span>
                <Button onClick={() => { logout(); setIsMobileMenuOpen(false); }} variant="secondary" size="sm" className="w-full">Logout</Button>
              </div>
            ) : (
              <div className="px-5">
                <Button onClick={() => { onAuthClick(); setIsMobileMenuOpen(false); }} variant="primary" size="sm" className="w-full">Login / Sign Up</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// Custom NavLink for active styling
const NavLink: React.FC<{ to: string; children: ReactNode; isMobile?: boolean; onClick?: () => void }> = ({ to, children, isMobile = false, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const baseClasses = isMobile 
    ? "block px-3 py-2 rounded-md text-base font-medium" 
    : "px-3 py-2 rounded-md text-sm font-medium";
  const activeClasses = isMobile ? "bg-gray-700 text-textPrimary" : "bg-gray-700 text-textPrimary";
  const inactiveClasses = isMobile ? "text-textSecondary hover:bg-gray-700 hover:text-textPrimary" : "text-textSecondary hover:bg-gray-700 hover:text-textPrimary";

  return (
    <Link to={to} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`} onClick={onClick}>
      {children}
    </Link>
  );
};


// --- Page Components ---
const HomePage: React.FC = () => (
  <div className="text-center py-12 px-4">
    <h1 className="text-5xl font-extrabold text-primary mb-6">Welcome to the Roblox Clicker Simulator Forum!</h1>
    <p className="text-xl text-textSecondary mb-8 max-w-2xl mx-auto">
      Your central hub for announcements, scripts, models, and community discussions related to the game.
      Join us, share your creations, and stay updated!
    </p>
    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Link to="/announcements" className="bg-surface p-6 rounded-lg shadow-lg hover:shadow-primary/50 hover:scale-105 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-secondary mb-2">Announcements</h2>
            <p className="text-textSecondary">Latest news and updates from admins.</p>
        </Link>
        <Link to="/scripts" className="bg-surface p-6 rounded-lg shadow-lg hover:shadow-primary/50 hover:scale-105 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-secondary mb-2">Scripts</h2>
            <p className="text-textSecondary">Share and find game scripts.</p>
        </Link>
        <Link to="/models" className="bg-surface p-6 rounded-lg shadow-lg hover:shadow-primary/50 hover:scale-105 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-secondary mb-2">Models</h2>
            <p className="text-textSecondary">Discover and contribute game models.</p>
        </Link>
    </div>
     <img src="https://picsum.photos/seed/robloxforum/800/400" alt="Roblox Forum Banner" className="mt-10 rounded-lg shadow-xl mx-auto"/>
  </div>
);

const GenericPostsPage: React.FC<{ category: PostCategory }> = ({ category }) => {
  const { getPostsByCategory, currentUser } = useAuth();
  const [posts, setPosts] = useState(getPostsByCategory(category));
  const [showPostForm, setShowPostForm] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setPosts(getPostsByCategory(category));
  }, [getPostsByCategory, category, currentUser]); // Re-fetch if category changes or user logs in/out (for form visibility)

  const handlePostSuccess = () => {
    setPosts(getPostsByCategory(category)); // Refresh posts list
    setShowPostForm(false);
  };
  
  const canPost = (category === PostCategory.ANNOUNCEMENT && currentUser?.role === UserRole.ADMIN) ||
                  (category !== PostCategory.ANNOUNCEMENT && !!currentUser);


  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">{category.charAt(0) + category.slice(1).toLowerCase()}</h1>
        {canPost && (
            <Button onClick={() => setShowPostForm(!showPostForm)} variant="primary">
            {showPostForm ? 'Cancel' : `New ${category.charAt(0) + category.slice(1).toLowerCase()}`}
            </Button>
        )}
      </div>
      
      {showPostForm && canPost && (
        <div className="mb-8">
          <PostForm category={category} onPostSuccess={handlePostSuccess} />
        </div>
      )}

      {posts.length === 0 ? (
        <p className="text-textSecondary text-center py-10">No {category.toLowerCase()}s yet. Be the first to post!</p>
      ) : (
        <div className="space-y-6">
          {posts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  );
};

const AdminPage: React.FC = () => (
  <div className="container mx-auto py-8 px-4">
    <h1 className="text-3xl font-bold text-primary mb-6">Admin Panel</h1>
    <AdminPanelContent />
  </div>
);

const VipPage: React.FC = () => (
 <div className="container mx-auto py-8 px-4">
    <VipLoungeContent />
  </div>
);

const NotFoundPage: React.FC = () => (
    <div className="text-center py-20">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <p className="text-2xl text-textSecondary mb-8">Oops! Page Not Found.</p>
        <Link to="/"><Button variant="primary">Go Home</Button></Link>
    </div>
);


// --- Protected Route HOC ---
interface ProtectedRouteProps {
  element: ReactNode;
  requiredRoles?: UserRole[];
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, requiredRoles }) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner size="lg"/></div>;
  }

  if (!currentUser) {
    return <Navigate to="/" state={{ message: "Please login to access this page." }} />;
  }
  if (requiredRoles && !requiredRoles.includes(currentUser.role)) {
    return <Navigate to="/" state={{ message: "You do not have permission to access this page." }} />;
  }
  return <>{element}</>;
};


// --- Main App Component ---
const AppContent: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading } = useAuth();
  const location = useLocation(); // For showing messages from redirects

  useEffect(() => {
    if (location.state && (location.state as any).message) {
      alert((location.state as any).message);
      // Clear the state to prevent alert on refresh
      window.history.replaceState({}, document.title)
    }
  }, [location.state]);


  if (isLoading) {
    return <div className="flex justify-center items-center h-screen bg-background"><LoadingSpinner size="lg" className="text-primary"/></div>;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onAuthClick={() => { setIsLoginMode(true); setIsAuthModalOpen(true); }} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/announcements" element={<GenericPostsPage category={PostCategory.ANNOUNCEMENT} />} />
          <Route path="/scripts" element={<GenericPostsPage category={PostCategory.SCRIPT} />} />
          <Route path="/models" element={<GenericPostsPage category={PostCategory.MODEL} />} />
          <Route path="/admin" element={<ProtectedRoute element={<AdminPage />} requiredRoles={[UserRole.ADMIN]} />} />
          <Route path="/vip-area" element={<ProtectedRoute element={<VipPage />} requiredRoles={[UserRole.VIP, UserRole.ADMIN]} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="bg-surface text-center p-4 text-textSecondary text-sm border-t border-borderLight">
        © {new Date().getFullYear()} Roblox Clicker Simulator Forum. All rights reserved.
      </footer>
      <Modal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} title={isLoginMode ? 'Login' : 'Sign Up'}>
        <AuthForm
          isLoginMode={isLoginMode}
          onSwitchMode={() => setIsLoginMode(!isLoginMode)}
          onSuccess={() => setIsAuthModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppContent/>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;

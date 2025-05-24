
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: 'user' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner text="Authenticating..." />;
  }

  if (!currentUser) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole === 'admin' && !currentUser.roles.includes('admin')) {
    // User is logged in but does not have admin role
    // Redirect to home or an "unauthorized" page. For simplicity, redirect to home.
    alert("Access Denied: You do not have permission to view this page.");
    return <Navigate to="/" replace />;
  }
  
  // If requiredRole is 'user' (or undefined, meaning just logged in is enough)
  // and currentUser exists, they are authorized.
  return children;
};

export default ProtectedRoute;

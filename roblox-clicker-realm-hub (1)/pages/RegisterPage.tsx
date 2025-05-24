
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';
import { RegisterIcon, KeyIcon } from '../constants';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registrationKey, setRegistrationKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!username || !password || !registrationKey) {
        setError("All fields are required.");
        return;
    }
    setIsLoading(true);
    const result = await auth.register(username, password, registrationKey);
    setIsLoading(false);
    if (result.success) {
      navigate('/'); // Navigate to home or dashboard after successful registration
    } else {
      setError(result.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 animate-fadeIn">
      <PageHeader title="Register Account" icon={<RegisterIcon className="w-10 h-10" />} />
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-textPrimary">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-textPrimary"
            />
          </div>

          <div>
            <label htmlFor="password"className="block text-sm font-medium text-textPrimary">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-textPrimary"
            />
          </div>

           <div>
            <label htmlFor="confirmPassword"className="block text-sm font-medium text-textPrimary">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-textPrimary"
            />
          </div>

          <div>
            <label htmlFor="registrationKey" className="flex items-center text-sm font-medium text-textPrimary">
              <KeyIcon className="w-4 h-4 mr-1 text-yellow-400" />
              Registration Key
            </label>
            <input
              id="registrationKey"
              name="registrationKey"
              type="text"
              required
              value={registrationKey}
              onChange={(e) => setRegistrationKey(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-textPrimary"
              placeholder="Ask an admin for a key"
            />
          </div>

          {error && <p className="text-sm text-red-400 bg-red-900/30 p-2 rounded-md text-center">{error}</p>}

          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
            Create Account
          </Button>
           <p className="text-sm text-center text-textSecondary">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-light">
              Sign in
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;

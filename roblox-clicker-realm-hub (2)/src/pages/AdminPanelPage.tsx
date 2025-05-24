
import React, { useState, useEffect } from 'react';
import { User, AdminStatsData, RegistrationKey } from '../types';
import PageHeader from '../components/PageHeader';
import { AdminIcon, KeyIcon } from '../constants';
import Card from '../components/Card';
import Button from '../components/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext'; 
import LoadingSpinner from '../components/LoadingSpinner';

const dailyJoinsData: AdminStatsData[] = [ 
  { name: 'Mon', users: 12 }, { name: 'Tue', users: 19 }, { name: 'Wed', users: 8 },
  { name: 'Thu', users: 15 }, { name: 'Fri', users: 25 }, { name: 'Sat', users: 33 },
  { name: 'Sun', users: 28 },
];

const AdminPanelPage: React.FC = () => {
  const { 
    users: authUsers, 
    isLoading: authLoading, 
    banUser, 
    unbanUser, 
    grantAdminRole, 
    revokeAdminRole, 
    generateRegistrationKey,
    registrationKeys,
    currentUser
  } = useAuth();
  
  const [localUsers, setLocalUsers] = useState<User[]>([]);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (authUsers) {
      setLocalUsers(authUsers.filter(u => u.id !== currentUser?.id)); 
    }
  }, [authUsers, currentUser]);

  const handleToggleBan = async (userId: string, currentStatus: 'Active' | 'Banned' | undefined) => {
    setActionLoading(prev => ({...prev, [`ban-${userId}`]: true}));
    if (currentStatus === 'Active') {
      await banUser(userId);
    } else {
      await unbanUser(userId);
    }
    setActionLoading(prev => ({...prev, [`ban-${userId}`]: false}));
  };

  const handleToggleAdminRole = async (userId: string, isCurrentlyAdmin: boolean) => {
     setActionLoading(prev => ({...prev, [`role-${userId}`]: true}));
    if (isCurrentlyAdmin) {
      await revokeAdminRole(userId);
    } else {
      await grantAdminRole(userId);
    }
    setActionLoading(prev => ({...prev, [`role-${userId}`]: false}));
  };
  
  const handleGenerateKey = async () => {
    setActionLoading(prev => ({...prev, generateKey: true}));
    const newKey = await generateRegistrationKey();
    if (newKey) {
      setGeneratedKey(newKey.value);
    } else {
      alert("Failed to generate key. See console for details.");
    }
    setActionLoading(prev => ({...prev, generateKey: false}));
  };

  if (authLoading) {
    return <LoadingSpinner text="Loading admin data..." />;
  }
  
  const activeUsersCount = authUsers.filter(u => u.status === 'Active').length;
  const bannedUsersCount = authUsers.filter(u => u.status === 'Banned').length;

  return (
    <div className="animate-fadeIn">
      <PageHeader title="Admin Panel" subtitle="Manage users, roles, and site activity." icon={<AdminIcon className="w-10 h-10" />} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card title="Total Users" className="text-center">
          <p className="text-5xl font-bold text-primary">{authUsers.length}</p>
        </Card>
        <Card title="Active Users" className="text-center">
          <p className="text-5xl font-bold text-green-400">{activeUsersCount}</p>
        </Card>
        <Card title="Banned Users" className="text-center">
          <p className="text-5xl font-bold text-red-500">{bannedUsersCount}</p>
        </Card>
      </div>
      
      <Card title="New User Registration Keys" className="mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button onClick={handleGenerateKey} variant="primary" isLoading={actionLoading.generateKey}>
            <KeyIcon className="w-5 h-5 mr-2" /> Generate New Key
          </Button>
          {generatedKey && (
            <div className="p-3 bg-gray-700 rounded-md">
              <p className="text-textPrimary">New Key: <strong className="text-secondary">{generatedKey}</strong> (Share this with users to register)</p>
            </div>
          )}
        </div>
        <h4 className="text-lg font-semibold mt-6 mb-2 text-textPrimary">Active Keys:</h4>
        {registrationKeys.filter(k => !k.isUsed).length > 0 ? (
            <ul className="list-disc list-inside text-textSecondary space-y-1 max-h-32 overflow-y-auto">
                {registrationKeys.filter(k => !k.isUsed).map(key => (
                    <li key={key.id}><code className="text-sm bg-gray-600 px-1 rounded">{key.value}</code> (Generated: {new Date(key.createdAt).toLocaleDateString()})</li>
                ))}
            </ul>
        ) : <p className="text-textSecondary">No active unused keys.</p>}
      </Card>
      
      <Card title="Site Activity (Mock Data)" className="mb-8">
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={dailyJoinsData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="name" tick={{ fill: '#9CA3AF' }} />
                    <YAxis tick={{ fill: '#9CA3AF' }} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem' }} 
                        labelStyle={{ color: '#F3F4F6' }}
                        itemStyle={{ color: '#818CF8' }}
                    />
                    <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                    <Bar dataKey="users" fill="#6366F1" barSize={30} radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </Card>

      <Card title="User Management">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="p-3">Username</th>
                <th className="p-3">Join Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Roles</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {localUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-700/30 transition-colors">
                  <td className="p-3">{user.username}</td>
                  <td className="p-3">{new Date(user.joinDate).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'Active' ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100'
                    }`}>
                      {user.status || 'N/A'}
                    </span>
                  </td>
                  <td className="p-3">{user.roles.join(', ')}</td>
                  <td className="p-3 text-right space-x-2">
                    <Button 
                      onClick={() => handleToggleBan(user.id, user.status)}
                      variant={user.status === 'Active' ? 'danger' : 'ghost'}
                      size="sm"
                      isLoading={actionLoading[`ban-${user.id}`]}
                    >
                      {user.status === 'Active' ? 'Ban' : 'Unban'}
                    </Button>
                    <Button 
                      onClick={() => handleToggleAdminRole(user.id, user.roles.includes('admin'))}
                      variant={user.roles.includes('admin') ? 'secondary' : 'primary'}
                      size="sm"
                      isLoading={actionLoading[`role-${user.id}`]}
                    >
                      {user.roles.includes('admin') ? 'Revoke Admin' : 'Grant Admin'}
                    </Button>
                  </td>
                </tr>
              ))}
               {localUsers.length === 0 && (
                <tr>
                    <td colSpan={5} className="p-4 text-center text-textSecondary">No other users to manage.</td>
                </tr>
               )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminPanelPage;

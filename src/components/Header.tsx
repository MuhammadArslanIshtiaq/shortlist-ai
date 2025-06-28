'use client';

import { User, Search, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut, getCurrentUser } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';
import NotificationPanel from './NotificationPanel';

export default function Header() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const user = await getCurrentUser();
        setUserEmail(user.username);
      } catch (error) {
        console.error('Error getting user info:', error);
      }
    };
    
    getUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      // Clear localStorage for compatibility
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      // Fallback to manual logout
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
      router.push('/login');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 h-20 flex items-center">
      <div className="flex items-center justify-between w-full">
        {/* Left side - Empty space to balance layout */}
        <div className="flex items-center">
          <div className="w-8 h-8"></div>
        </div>

        {/* Right side - Search, Notifications, Profile */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>

          {/* Notifications */}
          <NotificationPanel />

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">HR Manager</p>
              <p className="text-xs text-gray-500">{userEmail || 'Loading...'}</p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 
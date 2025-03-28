"use client";

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/firebase/auth';
import { useDashboard } from '@/context/DashboardContext';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { userData } = useDashboard();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Check localStorage for saved sidebar state
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);

  // Save sidebar state to localStorage
  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  const handleLogout = async () => {
    await logout();
    router.push('/signin');
  };

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    {
      name: 'Start Interview',
      href: '/dashboard/interview',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: 'Previous Interviews',
      href: '/dashboard/history',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: 'CV Analysis',
      href: '/dashboard/cv-analysis',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: 'Job Analysis',
      href: '/dashboard/job-analysis',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
          <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
        </svg>
      ),
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  return (
    <div 
      className={`flex h-screen flex-col bg-gray-900 border-r border-gray-800 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className={`flex items-center justify-center h-16 border-b border-gray-800 transition-all duration-300 ${
        isCollapsed ? 'px-2' : 'px-4' 
      }`}>
        {isCollapsed ? (
          <div className="h-8 w-8 flex-shrink-0 rounded-full bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">IA</span>
          </div>
        ) : (
          <h1 className="text-xl font-semibold text-white truncate">InterviewAce AI</h1>
        )}
      </div>
      
      <div className="flex flex-col justify-between flex-1 mt-6 overflow-y-auto">
        <nav>
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              title={isCollapsed ? item.name : ''}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} py-3 transition-colors ${
                pathname === item.href 
                  ? 'text-white bg-indigo-600' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className={isCollapsed ? '' : 'mr-3'}>{item.icon}</span>
              {!isCollapsed && <span className="transition-opacity duration-300">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className={`${isCollapsed ? 'px-2' : 'px-4'} py-6 border-t border-gray-800`}>
          {!isCollapsed && (
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {userData?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white truncate max-w-32">{userData?.name || user?.email}</p>
                <p className="text-xs text-gray-400">
                  {userData?.hasActiveSubscription ? 'Premium' : 'Free'} Account
                </p>
              </div>
            </div>
          )}
          
          <div className="flex flex-col space-y-2">
            {isCollapsed ? (
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="flex items-center justify-center w-full p-2 border border-transparent rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7z" clipRule="evenodd" />
                  <path d="M11 9.5a.5.5 0 01.5-.5h4a.5.5 0 010 1h-4a.5.5 0 01-.5-.5z" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                Sign Out
              </button>
            )}
            
            {/* Collapse/Expand Toggle Button */}
            <button
              onClick={toggleSidebar}
              className="flex items-center justify-center p-2 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M15.707 4.293a1 1 0 010 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M9.707 4.293a1 1 0 010 1.414L5.414 10l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
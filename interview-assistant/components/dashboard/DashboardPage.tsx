"use client";
import { useState, useRef, useEffect } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { useAuth } from "@/firebase/auth";  // Add this import
import Link from "next/link";
import Sidebar from "./Sidebar";

export default function DashboardPage() {
  const { userData } = useDashboard();
  const { user } = useAuth();  // Add this line to get access to the user object
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userDropdownRef.current && 
          !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar Component */}
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-gray-800 border-b border-gray-700 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="flex items-center text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-medium">Main Menu</span>
              </Link>
              <h1 className="text-xl font-semibold text-white">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* User Dropdown */}
              <div className="relative" ref={userDropdownRef}>
                <button 
                  className="flex items-center space-x-2 focus:outline-none"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium shadow-md">
                    {userData?.name ? userData.name.charAt(0).toUpperCase() : 
                     user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="ml-2 text-gray-300">{userData?.name || user?.email || 'User'}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
                    <div className="py-2">
                      <Link 
                        href="/dashboard/profile" 
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        Profile
                      </Link>
                      <Link 
                        href="/dashboard/statistics" 
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        Statistics
                      </Link>
                      <Link 
                        href="/dashboard/settings" 
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        Settings
                      </Link>
                      <div className="border-t border-gray-700 my-1"></div>
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => {/* Handle logout */}}
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6 bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-700 transform transition-all duration-300 hover:shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-4">
                Welcome, {userData?.name || 'there'}!
              </h2>
              <p className="text-gray-300">
                Your interview assistant is ready to help you succeed.
              </p>
            </div>
            {/* Account Status */}
            <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-700 transform transition-all duration-300 hover:shadow-lg">
              <h2 className="text-lg font-semibold text-white mb-4">Account Status</h2>
              <div className="flex items-center">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  userData?.hasActiveSubscription 
                    ? 'bg-green-900 text-green-300 border border-green-700' 
                    : 'bg-blue-900 text-blue-300 border border-blue-700'
                }`}>
                  {userData?.hasActiveSubscription ? 'Premium Account' : 'Free Account'}
                </div>
              </div>
              {!userData?.hasActiveSubscription && (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="mt-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-4 py-2 rounded-md hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 inline-block font-medium"
                >
                  Upgrade to Premium
                </button>
              )}
              
              {userData?.hasActiveSubscription && (
                <div className="mt-4 text-gray-300">
                  Enjoy unlimited access to all InterviewAce AI features.
                </div>
              )}
            </div>
            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-700 transform transition-all duration-300 hover:shadow-lg">
              <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Start Interview */}
                <Link href="/interview/new" className="group">
                  <div className="border border-gray-600 rounded-lg p-4 transition-all duration-300 hover:border-indigo-500 hover:bg-gray-700 hover:shadow-md h-full">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-900 flex items-center justify-center text-indigo-300 mr-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-white group-hover:text-indigo-300 transition-colors">Start Interview</h3>
                        <p className="text-sm text-gray-400">Begin a new interview session with AI assistance.</p>
                      </div>
                    </div>
                  </div>
                </Link>
                {/* CV Analysis */}
                <Link href="/cv-analysis" className="group">
                  <div className="border border-gray-600 rounded-lg p-4 transition-all duration-300 hover:border-indigo-500 hover:bg-gray-700 hover:shadow-md h-full">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-900 flex items-center justify-center text-indigo-300 mr-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-white group-hover:text-indigo-300 transition-colors">CV Analysis</h3>
                        <p className="text-sm text-gray-400">Get AI feedback on your resume or CV.</p>
                      </div>
                    </div>
                  </div>
                </Link>
                {/* Job Analysis */}
                <Link href="/job-analysis" className="group">
                  <div className="border border-gray-600 rounded-lg p-4 transition-all duration-300 hover:border-indigo-500 hover:bg-gray-700 hover:shadow-md h-full">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-900 flex items-center justify-center text-indigo-300 mr-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-white group-hover:text-indigo-300 transition-colors">Job Analysis</h3>
                        <p className="text-sm text-gray-400">Analyze job descriptions for better interview prep.</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            {/* Usage Stats for Premium Users */}
            {userData?.hasActiveSubscription && (
              <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-700 transform transition-all duration-300 hover:shadow-lg">
                <h2 className="text-lg font-semibold text-white mb-4">Your Activity</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col p-4 border border-gray-700 rounded-lg hover:border-indigo-500 transition-colors">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-blue-300 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <span className="text-gray-300">Interviews</span>
                    </div>
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-sm text-gray-400">0 this week</div>
                  </div>
                  
                  <div className="flex flex-col p-4 border border-gray-700 rounded-lg hover:border-indigo-500 transition-colors">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-green-900 flex items-center justify-center text-green-300 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <span className="text-gray-300">CV Analysis</span>
                    </div>
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-sm text-gray-400">0 this week</div>
                  </div>
                  
                  <div className="flex flex-col p-4 border border-gray-700 rounded-lg hover:border-indigo-500 transition-colors">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-purple-900 flex items-center justify-center text-purple-300 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-gray-300">Job Analysis</span>
                    </div>
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-sm text-gray-400">0 this week</div>
                  </div>
                </div>
              </div>
            )}
            {/* Free User Credits */}
            {!userData?.hasActiveSubscription && (
              <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-700 transform transition-all duration-300 hover:shadow-lg">
                <h2 className="text-lg font-semibold text-white mb-4">Your Credits</h2>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-yellow-900 flex items-center justify-center text-yellow-300 mr-4 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Available Credits</h3>
                      <div className="text-3xl font-bold text-white">{userData?.credits || 0}</div>
                    </div>
                  </div>
                  <Link href="/get-credits" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors shadow-md flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Get More Credits
                  </Link>
                </div>
                
                <div className="bg-gray-700 rounded-md p-4 text-sm text-gray-300 border-l-4 border-indigo-500">
                  <p>Credits are used for interview sessions, CV analysis, and job analysis. Each action costs 1 credit.</p>
                </div>
              </div>
            )}
            {/* Recent Activity */}
            <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700 transform transition-all duration-300 hover:shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                <Link href="/activity" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center">
                  View All
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              <div className="border border-gray-600 rounded-lg p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No recent activity</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Start using InterviewAce AI by creating an interview session, analyzing your CV, or exploring job descriptions.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Premium Upgrade Modal - Only show for free-tier users */}
      {!userData?.hasActiveSubscription && showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 relative border border-gray-700 animate-fadeIn">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Upgrade to Premium</h2>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Monthly Plan */}
                <div className="border border-gray-600 rounded-lg p-6 hover:border-indigo-500 transition-all duration-300 hover:shadow-lg">
                  <h3 className="text-xl font-semibold text-white mb-2">Monthly Plan</h3>
                  <p className="text-gray-400 mb-4">Billed monthly</p>
                  <div className="text-3xl font-bold text-white mb-6">
                    $60 <span className="text-base font-normal text-gray-400">/month</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      50 credits per month
                    </li>
                    <li className="flex items-center text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Flexible credit usage
                    </li>
                  </ul>
                  <Link href="/checkout/monthly" className="block w-full py-2 px-4 bg-indigo-600 text-center text-white rounded-md hover:bg-indigo-700 transition-colors font-medium shadow-md">
                    Choose Monthly
                  </Link>
                </div>
                {/* Annual Plan */}
                <div className="border-2 border-indigo-500 rounded-lg p-6 relative shadow-lg transform transition-transform duration-300 hover:scale-105">
                  <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    Best Value
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Annual Plan</h3>
                  <p className="text-gray-400 mb-4">Billed yearly</p>
                  <div className="text-3xl font-bold text-white mb-6">
                    $300 <span className="text-base font-normal text-gray-400">/year</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      50 credits per month (600 total)
                    </li>
                    <li className="flex items-center text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Save 20% compared to monthly
                    </li>
                    <li className="flex items-center text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Flexible credit usage
                    </li>
                  </ul>
                  <Link href="/checkout/annual" className="block w-full py-2 px-4 bg-indigo-600 text-center text-white rounded-md hover:bg-indigo-700 transition-colors font-medium shadow-md">
                    Choose Annual
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useRef, useEffect } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { useAuth } from "@/firebase/auth";
import Link from "next/link";
import Sidebar from "./Sidebar";

export default function DashboardPage() {
  const { userData } = useDashboard();
  const { user } = useAuth();
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
    <div className="flex h-screen bg-gray-950">
      {/* Sidebar Component */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-gray-900/80 border-b border-gray-800 backdrop-blur-sm shadow-md">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="flex items-center text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 px-4 py-2 rounded-lg transition-all duration-300 shadow-lg shadow-indigo-600/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-medium">Main Menu</span>
              </Link>
              <h1 className="text-xl font-semibold text-white">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* User Dropdown */}
              <div className="relative" ref={userDropdownRef}>
                <button 
                  className="flex items-center space-x-2 focus:outline-none group"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white font-medium shadow-md group-hover:from-indigo-500 group-hover:to-indigo-700 transition-all duration-300">
                    {userData?.name ? userData.name.charAt(0).toUpperCase() : 
                     user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="ml-2 text-gray-300 group-hover:text-white transition-colors">{userData?.name || user?.email || 'User'}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 text-gray-400 transition-all duration-300 group-hover:text-white ${showUserDropdown ? 'rotate-180' : ''}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-10 overflow-hidden animate-fade-in-down">
                    <div className="p-3 border-b border-gray-800 bg-gray-800/50">
                      <p className="text-sm font-medium text-gray-300">Signed in as</p>
                      <p className="text-sm text-white truncate font-semibold">{user?.email}</p>
                    </div>
                    <div className="py-2">
                      <Link 
                        href="/dashboard/profile" 
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600/20 hover:text-white transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>
                      <Link 
                        href="/dashboard/statistics" 
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600/20 hover:text-white transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Statistics
                      </Link>
                      <Link 
                        href="/dashboard/settings" 
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600/20 hover:text-white transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </Link>
                      <div className="border-t border-gray-800 my-1"></div>
                      <button 
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                        onClick={() => {/* Handle logout */}}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
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
        <main className="flex-1 overflow-auto p-6 bg-gradient-to-b from-gray-900 to-gray-950">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-gray-900 via-indigo-950/30 to-gray-900 rounded-xl p-8 mb-8 border border-gray-800/50 shadow-xl relative overflow-hidden group transition-all duration-300 hover:border-indigo-500/30">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 via-indigo-600/10 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                  Welcome, {userData?.name || 'there'}!
                </h2>
                <p className="text-indigo-200/80 text-lg max-w-2xl">
                  Your interview assistant is ready to help you succeed. Use our AI-powered tools to prepare for your next interview.
                </p>
              </div>
              
              <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Account Status Card */}
              <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/20 hover:shadow-indigo-500/5">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Account Status
                </h2>
                
                <div className="flex items-center mb-4">
                  <div className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                    userData?.hasActiveSubscription 
                      ? 'bg-green-900/30 text-green-300 border border-green-700/50' 
                      : 'bg-blue-900/30 text-blue-300 border border-blue-700/50'
                  }`}>
                    <div className={`h-2 w-2 rounded-full mr-2 ${userData?.hasActiveSubscription ? 'bg-green-400' : 'bg-blue-400'}`}></div>
                    {userData?.hasActiveSubscription ? 'Premium Account' : 'Free Account'}
                  </div>
                </div>
                
                {!userData?.hasActiveSubscription ? (
                  <div>
                    <p className="text-gray-400 mb-4 text-sm">Upgrade to Premium for unlimited access to all InterviewAce features and priority support.</p>
                    <button
                      onClick={() => setShowUpgradeModal(true)}
                      className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-2.5 px-4 rounded-lg hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 font-medium flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      Upgrade to Premium
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="p-3 border border-green-800/20 rounded-lg bg-green-900/10 mb-3">
                      <p className="text-green-300 text-sm">
                        <span className="font-medium">Premium Benefits:</span> Unlimited interviews, priority support, advanced analytics, and custom templates.
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Your premium subscription is active. Enjoy all features!</p>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/20 hover:shadow-indigo-500/5">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Quick Stats
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/60 rounded-lg p-4 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white mb-1">0</span>
                    <span className="text-sm text-gray-400">Total Interviews</span>
                  </div>
                  
                  <div className="bg-gray-800/60 rounded-lg p-4 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white mb-1">0</span>
                    <span className="text-sm text-gray-400">CV Analyses</span>
                  </div>
                </div>

                {!userData?.hasActiveSubscription && (
                  <div className="mt-4 flex items-center">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-400">Credits Available</span>
                        <span className="text-xs font-semibold text-indigo-300">{userData?.credits || 0}/10</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div className="bg-gradient-to-r from-indigo-600 to-indigo-400 h-2 rounded-full" style={{ width: `${((userData?.credits || 0) / 10) * 100}%` }}></div>
                      </div>
                    </div>
                    <Link href="/get-credits" className="ml-4 text-xs text-indigo-400 hover:text-indigo-300 whitespace-nowrap">
                      Get more
                    </Link>
                  </div>
                )}
              </div>

              {/* Next Steps */}
              <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/20 hover:shadow-indigo-500/5">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Next Steps
                </h2>
                
                <ul className="space-y-3">
                  <li className="flex">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full border-2 border-indigo-500 flex items-center justify-center mr-3 mt-0.5">
                      <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm text-white">Start your first interview session</p>
                      <p className="text-xs text-gray-400">Practice with AI assistance</p>
                    </div>
                  </li>
                  
                  <li className="flex">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full border-2 border-indigo-500/50 flex items-center justify-center mr-3 mt-0.5">
                      <div className="h-2 w-2 bg-indigo-500/50 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm text-white">Upload your CV for analysis</p>
                      <p className="text-xs text-gray-400">Get AI feedback to improve</p>
                    </div>
                  </li>
                  
                  <li className="flex">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full border-2 border-indigo-500/30 flex items-center justify-center mr-3 mt-0.5">
                      <div className="h-2 w-2 bg-indigo-500/30 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm text-white">Analyze a job description</p>
                      <p className="text-xs text-gray-400">Understand key requirements</p>
                    </div>
                  </li>
                </ul>
                
                <div className="mt-4">
                  <Link href="/dashboard/settings" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center">
                    Complete your profile
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center px-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Start Interview */}
                <Link href="/dashboard/interview" className="group">
                  <div className="h-full bg-gray-900/60 rounded-xl overflow-hidden border border-gray-800 shadow-lg transition-all duration-300 hover:border-indigo-500/30 hover:shadow-indigo-500/10 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-indigo-800/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="p-6 relative z-10">
                      <div className="bg-indigo-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-indigo-300 group-hover:text-white group-hover:bg-indigo-600 transition-all duration-300 shadow-lg shadow-indigo-900/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">Start Interview</h3>
                      <p className="text-gray-400 mb-4 text-sm">Begin a new interview session with real-time AI assistance.</p>
                      <div className="flex items-center text-indigo-400 text-sm group-hover:text-indigo-300 transition-colors">
                        <span>Start now</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* CV Analysis */}
                <Link href="/dashboard/cv-analysis" className="group">
                  <div className="h-full bg-gray-900/60 rounded-xl overflow-hidden border border-gray-800 shadow-lg transition-all duration-300 hover:border-indigo-500/30 hover:shadow-indigo-500/10 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-indigo-800/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="p-6 relative z-10">
                      <div className="bg-indigo-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-indigo-300 group-hover:text-white group-hover:bg-indigo-600 transition-all duration-300 shadow-lg shadow-indigo-900/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">CV Analysis</h3>
                      <p className="text-gray-400 mb-4 text-sm">Get tailored feedback on your resume or CV from our advanced AI.</p>
                      <div className="flex items-center text-indigo-400 text-sm group-hover:text-indigo-300 transition-colors">
                        <span>Upload CV</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Job Analysis */}
                <Link href="/dashboard/job-analysis" className="group">
                  <div className="h-full bg-gray-900/60 rounded-xl overflow-hidden border border-gray-800 shadow-lg transition-all duration-300 hover:border-indigo-500/30 hover:shadow-indigo-500/10 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-indigo-800/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="p-6 relative z-10">
                      <div className="bg-indigo-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-indigo-300 group-hover:text-white group-hover:bg-indigo-600 transition-all duration-300 shadow-lg shadow-indigo-900/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">Job Analysis</h3>
                      <p className="text-gray-400 mb-4 text-sm">Analyze job descriptions to better prepare for targeted interviews.</p>
                      <div className="flex items-center text-indigo-400 text-sm group-hover:text-indigo-300 transition-colors">
                        <span>Analyze job</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex justify-between items-center mb-4 px-1">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Recent Activity
                </h2>
                <Link href="/dashboard/history" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center transition-colors">
                  View all
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              
              <div className="bg-gray-900/60 rounded-xl p-8 border border-gray-800 shadow-lg backdrop-blur-sm text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-800/60 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-white mb-3">No recent activity</h3>
                <p className="text-gray-400 max-w-lg mx-auto mb-6">
                  Start using InterviewAce AI by creating an interview session, analyzing your CV, or exploring job descriptions.
                </p>
                <Link 
                  href="/dashboard/interview"
                  className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-5 py-3 rounded-lg hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/40 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Your First Interview
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Premium Upgrade Modal */}
      {!userData?.hasActiveSubscription && showUpgradeModal && (
        <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full mx-4 border border-gray-800 overflow-hidden animate-fade-in-up">
            <div className="relative">
              {/* Modal Header with gradient background */}
              <div className="bg-gradient-to-r from-indigo-800 to-indigo-600 p-6">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h2 className="text-2xl font-bold text-white">Upgrade to Premium</h2>
                <p className="text-indigo-200 mt-1">Unlock the full potential of InterviewAce AI</p>
              </div>
              
              {/* Modal Body */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Monthly Plan */}
                  <div className="border border-gray-800 rounded-xl p-6 hover:border-indigo-500 transition-all duration-300 hover:shadow-xl bg-gray-900/50 h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">Monthly Plan</h3>
                        <p className="text-gray-400 text-sm">Billed monthly</p>
                      </div>
                      <div className="bg-gray-800 p-1 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="flex items-baseline mb-6">
                      <span className="text-4xl font-bold text-white">$60</span>
                      <span className="text-lg text-gray-400 ml-1">/month</span>
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300 text-sm">50 credits refreshed monthly</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300 text-sm">Priority AI assistance</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300 text-sm">Advanced analytics</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300 text-sm">Cancel anytime</span>
                      </li>
                    </ul>
                    
                    <Link href="/checkout/monthly" className="block w-full py-3 px-4 bg-indigo-600 text-center text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md">
                      Choose Monthly
                    </Link>
                  </div>
                  
                  {/* Annual Plan */}
                  <div className="relative border-2 border-indigo-500 rounded-xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 bg-gray-900/50 h-full">
                    <div className="absolute top-0 right-8 transform -translate-y-1/2">
                      <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                        BEST VALUE
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">Annual Plan</h3>
                        <p className="text-gray-400 text-sm">Billed yearly</p>
                      </div>
                      <div className="bg-indigo-600/50 p-1 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="flex items-baseline mb-6">
                      <span className="text-4xl font-bold text-white">$300</span>
                      <span className="text-lg text-gray-400 ml-1">/year</span>
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300 text-sm">50 credits monthly (600 total)</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300 text-sm"><span className="font-medium text-indigo-300">Save 20%</span> compared to monthly</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300 text-sm">Priority AI assistance</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300 text-sm">Advanced analytics & premium templates</span>
                      </li>
                    </ul>
                    
                    <Link href="/checkout/annual" className="block w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-center text-white rounded-lg hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 font-medium shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30">
                      Choose Annual
                    </Link>
                  </div>
                </div>
                
                <div className="mt-6 bg-indigo-900/20 rounded-lg p-4 border border-indigo-800/30">
                  <p className="text-indigo-300 text-sm">
                    All plans include unlimited access to our AI-powered interview simulations, CV analyzer, and job description parser tools. Need a custom enterprise plan? <a href="#" className="text-indigo-400 hover:text-indigo-300 underline">Contact us</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
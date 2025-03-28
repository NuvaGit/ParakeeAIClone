"use client";

import { useState } from "react";
import { useDashboard } from "@/context/DashboardContext";
import Link from "next/link";
import Sidebar from "./Sidebar";

export default function DashboardPage() {
  const { userData } = useDashboard();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  return (
    <>
      <div className="flex h-screen bg-gray-950">
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-950">
          {/* Top Header */}
          <header className="bg-gray-900/50 border-b border-gray-800 px-6 py-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-white">Dashboard</h1>
              
              <div className="flex items-center space-x-4">
                <button className="relative text-gray-400 hover:text-white focus:outline-none group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-gray-900"></span>
                </button>
                
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-indigo-600/30 flex items-center justify-center">
                    <span className="text-indigo-300 font-medium">
                      {userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-6">
            <div className="mb-8">
              <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
                Welcome, {userData?.name || 'there'}!
              </h1>
              <p className="mt-2 text-indigo-200/65 text-lg">
                Your interview assistant is ready to help you succeed.
              </p>
            </div>

            {/* Account Status */}
            <div className="bg-gray-900/50 rounded-lg p-6 mb-8 border border-gray-800 backdrop-blur-sm hover:border-indigo-500/30 transition-all duration-300 shadow-lg shadow-gray-950/50">
              <h2 className="text-xl font-semibold text-gray-200 mb-4">Account Status</h2>
              <div className="flex items-center">
                <div className={`h-3 w-3 rounded-full mr-2 ${userData?.hasActiveSubscription ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <p className="text-gray-300">
                  {userData?.hasActiveSubscription ? 'Premium Account' : 'Free Account'}
                </p>
              </div>
              {!userData?.hasActiveSubscription && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-4 py-2 rounded-md hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 inline-block"
                  >
                    Upgrade to Premium
                  </button>
                </div>
              )}
              {userData?.hasActiveSubscription && (
                <div className="mt-4">
                  <p className="text-green-400 text-sm font-medium">
                    Enjoy unlimited access to all InterviewAce AI features.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <h2 className="text-xl font-semibold text-gray-200 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Start Interview */}
              <div className="bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 group">
                <Link href="/dashboard/interview" className="block p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-600/20 mb-4 group-hover:bg-indigo-600/40 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-200 mb-1">Start Interview</h3>
                  <p className="text-indigo-200/65 text-sm">Begin a new interview session with AI assistance.</p>
                </Link>
              </div>

              {/* CV Analysis */}
              <div className="bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 group">
                <Link href="/dashboard/cv-analysis" className="block p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-600/20 mb-4 group-hover:bg-indigo-600/40 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-200 mb-1">CV Analysis</h3>
                  <p className="text-indigo-200/65 text-sm">Get AI feedback on your resume or CV.</p>
                </Link>
              </div>

              {/* Job Analysis */}
              <div className="bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 group">
                <Link href="/dashboard/job-analysis" className="block p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-600/20 mb-4 group-hover:bg-indigo-600/40 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-200 mb-1">Job Analysis</h3>
                  <p className="text-indigo-200/65 text-sm">Analyze job descriptions for better interview prep.</p>
                </Link>
              </div>
            </div>

            {/* Usage Stats for Premium Users */}
            {userData?.hasActiveSubscription && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4">Your Activity</h2>
                <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 backdrop-blur-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-indigo-500/30 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-400">Interviews</p>
                        <div className="h-8 w-8 rounded-full bg-indigo-600/20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0z" />
                            <path d="M8 9a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-3xl font-bold text-white">0</p>
                      <p className="text-xs text-gray-400 mt-1">0 this week</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-indigo-500/30 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-400">CV Analysis</p>
                        <div className="h-8 w-8 rounded-full bg-indigo-600/20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-3xl font-bold text-white">0</p>
                      <p className="text-xs text-gray-400 mt-1">0 this week</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray700 hover:border-indigo-500/30 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-400">Job Analysis</p>
                        <div className="h-8 w-8 rounded-full bg-indigo-600/20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-3xl font-bold text-white">0</p>
                      <p className="text-xs text-gray-400 mt-1">0 this week</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Free User Credits */}
            {!userData?.hasActiveSubscription && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4">Your Credits</h2>
                <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 backdrop-blur-sm shadow-lg shadow-gray-950/50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-indigo-600/20 flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Available Credits</p>
                          <p className="text-3xl font-bold text-white">{userData?.credits || 0}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Link
                        href="/dashboard/settings"
                        className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-4 py-2 rounded-md hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 inline-block"
                      >
                        Get More Credits
                      </Link>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="flex items-center text-sm text-indigo-200/65">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <p>Credits are used for interview sessions, CV analysis, and job analysis. Each action costs 1 credit.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-200">Recent Activity</h2>
                <Link href="/dashboard/history" className="text-sm text-indigo-400 hover:text-indigo-300">
                  View All
                </Link>
              </div>
              
              <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 backdrop-blur-sm">
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-lg mb-2">No recent activity</p>
                  <p className="text-gray-500 text-sm text-center max-w-md">
                    Start using InterviewAce AI by creating an interview session, analyzing your CV, or exploring job descriptions.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Premium Upgrade Modal - Only show for free-tier users */}
      {!userData?.hasActiveSubscription && showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 rounded-2xl max-w-2xl w-full mx-4 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800 relative">
              <h2 className="text-2xl font-bold text-white">Upgrade to Premium</h2>
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 p-6">
              {/* Monthly Plan */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-2">Monthly Plan</h3>
                <p className="text-gray-400 mb-4">Billed monthly</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">$60</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    50 credits per month
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Flexible credit usage
                  </li>
                </ul>
                <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition">
                  Choose Monthly
                </button>
              </div>

              {/* Annual Plan */}
              <div className="bg-gray-800 rounded-xl p-6 border-2 border-indigo-600">
                <div className="absolute -top-3 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs">
                  Best Value
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Annual Plan</h3>
                <p className="text-gray-400 mb-4">Billed yearly</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">$300</span>
                  <span className="text-gray-400">/year</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    50 credits per month (600 total)
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Save 20% compared to monthly
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Flexible credit usage
                  </li>
                </ul>
                <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition">
                  Choose Annual
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
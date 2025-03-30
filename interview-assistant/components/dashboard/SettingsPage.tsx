"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { doc, updateDoc, onSnapshot, DocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from "@/firebase/config";
import { useAuth } from '@/firebase/auth';
import Sidebar from "./Sidebar";

const { user } = useAuth();


// Define type for keyboard shortcuts
type Hotkey = {
  name: string;
  key: string;
  description: string;
};

// Default hotkeys
const DEFAULT_HOTKEYS: Hotkey[] = [
  { name: 'activateAI', key: 'Space', description: 'Activate AI' },
  { name: 'hideOverlay', key: 'Escape', description: 'Hide Overlay' },
  { name: 'nextSuggestion', key: 'Tab', description: 'Next Suggestion' },
  { name: 'useSuggestion', key: 'Enter', description: 'Use Suggestion' },
  { name: 'takeScreenshot', key: 'F2', description: 'Take Screenshot' } // Added screenshot hotkey
];

export default function SettingsPage() {
  const { userData } = useDashboard();
  const [isSaving, setIsSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');
  
  // Form states
  const [name, setName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual' | null>(null);
  
  // Hotkeys state
  const [hotkeys, setHotkeys] = useState<Hotkey[]>(DEFAULT_HOTKEYS);
  const [editingHotkey, setEditingHotkey] = useState<string | null>(null);

  // Initialize state from user data
  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setSecondName(userData.secondName || '');
    }
    
    // Load hotkeys from localStorage
    const savedHotkeys = localStorage.getItem('hotkeys');
    if (savedHotkeys) {
      try {
        const parsedHotkeys = JSON.parse(savedHotkeys);
        // Rest of the hotkeys logic
      } catch (e) {
        console.error('Failed to parse saved hotkeys:', e);
      }
    }
  }, [userData]);
  
  // Add a separate effect for user-specific Firestore listeners if needed
  useEffect(() => {
    if (!user) return;
    
    // Listen for user subscription status changes
    const subscriptionRef = doc(db, "subscriptions", user.uid);
    const unsubscribeSubscription = onSnapshot(
      subscriptionRef, 
      (docSnap: DocumentSnapshot<DocumentData>) => {
        if (docSnap.exists()) {
          const subscriptionData = docSnap.data();
          setSelectedPlan(subscriptionData?.interval === 'month' ? 'monthly' : 'annual');
        }
      }, 
      (error: Error) => {
        console.error("Error fetching subscription:", error);
      }
    );
    
    // Return cleanup function
    return () => {
      unsubscribeSubscription();
      console.log("Cleaned up settings page listeners");
    };
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(false);
    setProfileError('');
    
    if (!userData) return;
    
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "users", userData.email), {
        name,
        secondName,
        updatedAt: new Date().toISOString()
      });
      
      setProfileSuccess(true);
    } catch (error) {
      setProfileError('Failed to update profile. Please try again.');
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePlanSelect = (plan: 'monthly' | 'annual') => {
    setSelectedPlan(plan);
  };

  const handlePlanPurchase = () => {
    // In the future, this would integrate with your payment processor (Stripe, etc.)
    alert(`You've selected the ${selectedPlan} plan. This would normally redirect to a payment page.`);
  };

  // Start editing a hotkey
  const startEditingHotkey = (keyName: string) => {
    setEditingHotkey(keyName);
  };

  // Handle hotkey change when a new key is pressed
  const handleHotkeyChange = (e: React.KeyboardEvent<HTMLDivElement>, hotkeyName: string) => {
    e.preventDefault();
    
    // Get key name
    let keyDisplay = e.key;
    
    // Format special keys for better readability
    if (e.key === " ") keyDisplay = "Space";
    if (e.key === "Escape") keyDisplay = "Esc";
    if (e.key === "ArrowUp") keyDisplay = "↑";
    if (e.key === "ArrowDown") keyDisplay = "↓";
    if (e.key === "ArrowLeft") keyDisplay = "←";
    if (e.key === "ArrowRight") keyDisplay = "→";
    
    // Update hotkey
    const updatedHotkeys = hotkeys.map(hk => 
      hk.name === hotkeyName ? { ...hk, key: keyDisplay } : hk
    );
    
    setHotkeys(updatedHotkeys);
    setEditingHotkey(null);
    
    // Save to localStorage
    localStorage.setItem('hotkeys', JSON.stringify(updatedHotkeys));
  };

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-950">
        <main className="flex-1 p-6 md:p-8">
          <div className="mb-8">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Settings
            </h1>
            <p className="mt-2 text-indigo-200/65 text-lg">
              Manage your account and subscription
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Settings */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-semibold text-gray-200 mb-6">Profile Settings</h2>
                
                <form onSubmit={handleUpdateProfile}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-indigo-200/65 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full form-input bg-gray-800 border-gray-700 rounded-md text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="secondName" className="block text-sm font-medium text-indigo-200/65 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="secondName"
                        value={secondName}
                        onChange={(e) => setSecondName(e.target.value)}
                        className="w-full form-input bg-gray-800 border-gray-700 rounded-md text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="email" className="block text-sm font-medium text-indigo-200/65 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={userData?.email || ''}
                        className="w-full form-input bg-gray-800 border-gray-700 rounded-md text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                        disabled
                      />
                      <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                    </div>
                  </div>

                  {profileSuccess && (
                    <div className="mt-4 bg-green-500/10 p-3 rounded-md border border-green-500/20">
                      <p className="text-sm text-green-400">Profile updated successfully!</p>
                    </div>
                  )}

                  {profileError && (
                    <div className="mt-4 bg-red-500/10 p-3 rounded-md border border-red-500/20">
                      <p className="text-sm text-red-400">{profileError}</p>
                    </div>
                  )}

                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="btn bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] py-2 px-4 rounded-md disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Account Status */}
            <div>
              <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 mb-6">
                <h2 className="text-xl font-semibold text-gray-200 mb-4">Account Status</h2>
                <div className="flex items-center mb-4">
                  <div className={`h-3 w-3 rounded-full mr-2 ${userData?.hasActiveSubscription ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <p className="text-gray-300">
                    {userData?.hasActiveSubscription ? 'Premium Account' : 'Free Account'}
                  </p>
                </div>
                {userData?.hasActiveSubscription ? (
                  <div className="bg-gray-800/50 rounded p-3 border border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">Plan:</span>
                      <span className="text-sm text-gray-300">Premium Monthly</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">Renews on:</span>
                      <span className="text-sm text-gray-300">April 15, 2025</span>
                    </div>
                    <div className="mt-3">
                      <button className="text-sm text-red-400 hover:text-red-300">
                        Cancel Subscription
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">
                      You currently have <span className="text-white font-medium">{userData?.credits || 0} credits</span> remaining.
                    </p>
                  </div>
                )}
              </div>

              {!userData?.hasActiveSubscription && (
                <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
                  <h2 className="text-xl font-semibold text-gray-200 mb-4">Upgrade to Premium</h2>
                  
                  <div className="space-y-4">
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer ${
                        selectedPlan === 'monthly' 
                          ? 'border-indigo-500 bg-indigo-900/20' 
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                      onClick={() => handlePlanSelect('monthly')}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-medium">Monthly Plan</h3>
                          <p className="text-gray-400 text-sm">$60 per month</p>
                        </div>
                        <div className="h-5 w-5 rounded-full border border-gray-600 flex items-center justify-center">
                          {selectedPlan === 'monthly' && (
                            <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        50 credits per month, unlimited interview assistance
                      </div>
                    </div>
                    
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer ${
                        selectedPlan === 'annual' 
                          ? 'border-indigo-500 bg-indigo-900/20' 
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                      onClick={() => handlePlanSelect('annual')}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-medium">Annual Plan</h3>
                          <p className="text-gray-400 text-sm">$300 per year</p>
                        </div>
                        <div className="h-5 w-5 rounded-full border border-gray-600 flex items-center justify-center">
                          {selectedPlan === 'annual' && (
                            <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        50 credits per month for 12 months, save $420 compared to monthly
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      onClick={handlePlanPurchase}
                      disabled={!selectedPlan}
                      className="btn w-full bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] py-2 rounded-md disabled:opacity-50"
                    >
                      Upgrade Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interview Settings */}
          <div className="mt-8">
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-gray-200 mb-6">Interview Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-300 mb-2">AI Response Mode</h3>
                  <div className="flex items-center">
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        name="autoResponse" 
                        id="autoResponse" 
                        className="sr-only peer"
                        defaultChecked={true}
                      />
                      <div className="h-6 w-11 bg-gray-700 rounded-full peer peer-checked:bg-indigo-600"></div>
                      <div className="absolute left-0.5 top-0.5 h-5 w-5 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                    </div>
                    <label htmlFor="autoResponse" className="text-sm text-gray-300">
                      Automatic responses
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    When enabled, AI will automatically suggest responses during interviews.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-gray-300 mb-2">Response Style</h3>
                  <select className="w-full form-select bg-gray-800 border-gray-700 rounded-md text-gray-200 focus:ring-indigo-500 focus:border-indigo-500">
                    <option>Detailed (Comprehensive answers)</option>
                    <option>Concise (Short and direct answers)</option>
                    <option>Balanced (Mix of detail and brevity)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Choose how AI should structure responses during interviews.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-gray-300 mb-2">Keyboard Shortcuts</h3>
                  <p className="text-sm text-gray-400 mb-3">Click on a shortcut to change it</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {hotkeys.map((hotkey) => (
                      <div 
                        key={hotkey.name}
                        className="bg-gray-800/50 rounded p-4 border border-gray-700 flex justify-between items-center"
                      >
                        <span className="text-sm text-gray-400">{hotkey.description}:</span>
                        
                        {editingHotkey === hotkey.name ? (
                          <div 
                            className="inline-block bg-indigo-600/30 text-indigo-300 px-3 py-1 rounded text-xs font-mono focus:outline-none"
                            tabIndex={0}
                            onKeyDown={(e) => handleHotkeyChange(e, hotkey.name)}
                            onBlur={() => setEditingHotkey(null)}
                            autoFocus
                          >
                            Press any key...
                          </div>
                        ) : (
                          <div 
                            className="inline-block bg-gray-700 text-gray-300 px-3 py-1 rounded text-xs font-mono cursor-pointer hover:bg-gray-600"
                            onClick={() => startEditingHotkey(hotkey.name)}
                          >
                            {hotkey.key}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy and Data */}
          <div className="mt-8 mb-12">
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-gray-200 mb-6">Privacy & Data</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        name="dataCollection" 
                        id="dataCollection" 
                        className="sr-only peer"
                        defaultChecked={true}
                      />
                      <div className="h-6 w-11 bg-gray-700 rounded-full peer peer-checked:bg-indigo-600"></div>
                      <div className="absolute left-0.5 top-0.5 h-5 w-5 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                    </div>
                    <label htmlFor="dataCollection" className="text-sm text-gray-300">
                      Help improve our AI with your interview data
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Your data is anonymized and helps train our AI to provide better responses.
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        name="emailUpdates" 
                        id="emailUpdates" 
                        className="sr-only peer"
                        defaultChecked={true}
                      />
                      <div className="h-6 w-11 bg-gray-700 rounded-full peer peer-checked:bg-indigo-600"></div>
                      <div className="absolute left-0.5 top-0.5 h-5 w-5 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                    </div>
                    <label htmlFor="emailUpdates" className="text-sm text-gray-300">
                      Receive email updates and tips
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    We'll send you interview tips and platform updates.
                  </p>
                </div>
                
                <div className="pt-4 border-t border-gray-800">
                  <button className="text-sm text-red-400 hover:text-red-300">
                    Delete All My Data
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    This will permanently delete all your interviews, CV analyses, and account data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
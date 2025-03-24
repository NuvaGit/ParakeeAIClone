import React from 'react';
import Navbar from '../components/layout/Navbar';
import ProfileSetup from '../components/auth/ProfileSetup';

const Profile = ({ setup = false }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {setup ? (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center text-gray-900">Complete Your Profile</h2>
            <p className="mt-2 text-center text-gray-600">
              Set up your profile to get personalized interview assistance.
            </p>
          </div>
        ) : (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center text-gray-900">Your Profile</h2>
            <p className="mt-2 text-center text-gray-600">
              Update your information to improve AI response suggestions.
            </p>
          </div>
        )}
        <ProfileSetup />
      </div>
    </div>
  );
};

export default Profile;
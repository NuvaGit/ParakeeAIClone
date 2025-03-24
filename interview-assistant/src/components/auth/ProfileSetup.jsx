import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const ProfileSetup = () => {
  const { currentUser, userProfile, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [displayName, setDisplayName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [industry, setIndustry] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [resumeText, setResumeText] = useState('');

  // Load existing profile data if available
  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setJobTitle(userProfile.jobTitle || '');
      setIndustry(userProfile.industry || '');
      setYearsExperience(userProfile.yearsExperience || '');
      setSkills(userProfile.skills ? userProfile.skills.join(', ') : '');
      setResumeText(userProfile.resumeData?.plainText || '');
    }
  }, [userProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const skillsArray = skills.split(',').map(skill => skill.trim()).filter(Boolean);
      
      await updateProfile({
        displayName,
        jobTitle,
        industry,
        yearsExperience: Number(yearsExperience) || 0,
        skills: skillsArray,
        resumeData: {
          plainText: resumeText,
          lastUpdated: new Date().toISOString()
        },
        profileComplete: true
      });
      
      navigate('/interview');
    } catch (error) {
      setError('Failed to update profile: ' + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h2>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      
      <p className="mb-6 text-gray-600">
        This information helps the AI generate better responses tailored to your experience and goals.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="displayName">
            Full Name
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="jobTitle">
            Current or Target Job Title
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            id="jobTitle"
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="industry">
            Industry
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            id="industry"
            type="text"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="yearsExperience">
            Years of Experience
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            id="yearsExperience"
            type="number"
            min="0"
            max="50"
            value={yearsExperience}
            onChange={(e) => setYearsExperience(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="skills">
            Key Skills (comma-separated)
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            id="skills"
            type="text"
            placeholder="e.g. JavaScript, React, Project Management"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="resumeText">
            Resume Summary (or paste your entire resume)
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            id="resumeText"
            rows="8"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here or provide a brief summary of your experience"
          ></textarea>
          <p className="mt-1 text-sm text-gray-500">
            This information is securely stored and only used to personalize your interview assistance.
          </p>
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
            onClick={() => navigate('/interview')}
          >
            Skip for Now
          </button>
          
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 disabled:bg-blue-300"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSetup;
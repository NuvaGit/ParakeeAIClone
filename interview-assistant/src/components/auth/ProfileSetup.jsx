// src/components/auth/ProfileSetup.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../contexts/AuthContext";
import { Button, Input, Textarea, Card, Alert, Tabs, Badge, Progress } from '../ui/UIComponents';

const ProfileSetup = () => {
  const { userProfile, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const [completionPercentage, setCompletionPercentage] = useState(0);
  
  // Form state
  const [displayName, setDisplayName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [industry, setIndustry] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);

  // Animation effect on mount
  useEffect(() => {
    setShowAnimation(true);
  }, []);

  // Load existing profile data if available
  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setJobTitle(userProfile.jobTitle || '');
      setIndustry(userProfile.industry || '');
      setYearsExperience(userProfile.yearsExperience || '');
      setSkills(userProfile.skills ? userProfile.skills.join(', ') : '');
      setResumeText(userProfile.resumeData?.plainText || '');
      
      // Calculate completion percentage
      calculateCompletionPercentage();
    }
  }, [userProfile]);
  
  // Calculate profile completion percentage
  const calculateCompletionPercentage = () => {
    let fields = 0;
    let completed = 0;
    
    if (displayName) completed++;
    fields++;
    
    if (jobTitle) completed++;
    fields++;
    
    if (industry) completed++;
    fields++;
    
    if (yearsExperience) completed++;
    fields++;
    
    if (skills) completed++;
    fields++;
    
    if (resumeText) completed++;
    fields++;
    
    const percentage = Math.round((completed / fields) * 100);
    setCompletionPercentage(percentage);
  };
  
  // Update completion percentage when fields change
  useEffect(() => {
    calculateCompletionPercentage();
  }, [displayName, jobTitle, industry, yearsExperience, skills, resumeText]);

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
  
  // Define tabs
  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'career', label: 'Career' },
    { id: 'resume', label: 'Resume' },
  ];

  return (
    <Card className={`overflow-visible px-6 py-8 shadow-xl ${showAnimation ? 'animate-scale-in' : 'opacity-0'}`}>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">Complete Your Profile</h2>
            <p className="text-zinc-600 mt-1">
              Personalize AI responses with your background information
            </p>
          </div>
          <div className="mt-2 sm:mt-0">
            <Badge variant={completionPercentage < 50 ? 'warning' : completionPercentage === 100 ? 'success' : 'primary'}>
              {completionPercentage}% Complete
            </Badge>
          </div>
        </div>
        
        <Progress 
          value={completionPercentage} 
          color={completionPercentage < 50 ? 'warning' : completionPercentage === 100 ? 'success' : 'primary'}
        />
      </div>
      
      {error && (
        <Alert
          variant="error"
          className="mb-6"
          dismissible
          onDismiss={() => setError('')}
        >
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Tabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
          variant="pills"
          className="mb-6"
        />
        
        {activeTab === 'personal' && (
          <div className="space-y-4 animate-fade-in">
            <Input
              id="displayName"
              type="text"
              label="Full Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
        )}
        
        {activeTab === 'career' && (
          <div className="space-y-4 animate-fade-in">
            <Input
              id="jobTitle"
              type="text"
              label="Current or Target Job Title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Software Engineer"
              required
            />
            
            <Input
              id="industry"
              type="text"
              label="Industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="Technology"
              required
            />
            
            <Input
              id="yearsExperience"
              type="number"
              label="Years of Experience"
              value={yearsExperience}
              onChange={(e) => setYearsExperience(e.target.value)}
              min="0"
              max="50"
              placeholder="3"
              required
            />
            
            <Input
              id="skills"
              type="text"
              label="Key Skills (comma-separated)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="JavaScript, React, Project Management"
              required
              helperText="Include technical and soft skills relevant to your target position"
            />
          </div>
        )}
        
        {activeTab === 'resume' && (
          <div className="animate-fade-in">
            <Textarea
              id="resumeText"
              label="Resume Summary (or paste your entire resume)"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here or provide a brief summary of your experience"
              rows="8"
              helperText="This information is securely stored and only used to personalize your interview assistance"
            />
          </div>
        )}
        
        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/interview')}
            className="mt-4 sm:mt-0"
          >
            Skip for Now
          </Button>
          
          <div className="flex space-x-4">
            {activeTab !== 'personal' && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                  if (currentIndex > 0) {
                    setActiveTab(tabs[currentIndex - 1].id);
                  }
                }}
              >
                Previous
              </Button>
            )}
            
            {activeTab !== 'resume' ? (
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                  if (currentIndex < tabs.length - 1) {
                    setActiveTab(tabs[currentIndex + 1].id);
                  }
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                className="relative overflow-hidden group"
              >
                <span className="relative z-10">Save Profile</span>
                <span className="absolute top-0 left-0 w-0 h-full bg-primary-600 group-hover:w-full transition-all duration-300 ease-out"></span>
              </Button>
            )}
          </div>
        </div>
      </form>
    </Card>
  );
};

export default ProfileSetup;
import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from "../contexts/AuthContext";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../../firebase/config';
import Navbar from '../layout/Navbar';
import "/src/assets/css/Profile.css";

const Profile = ({ setup = false }) => {
  const { currentUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(setup);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    jobTitle: '',
    bio: ''
  });

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setProfile(userData);
            setFormData({
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              jobTitle: userData.jobTitle || '',
              bio: userData.bio || ''
            });
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };

    fetchProfile();
  }, [currentUser]);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Upload profile image
  const uploadProfileImage = async () => {
    if (!profileImage) return null;
    
    try {
      const storageRef = ref(storage, `profileImages/${currentUser.uid}`);
      await uploadBytes(storageRef, profileImage);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      return null;
    }
  };

  // Save profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    try {
      // Upload image if new image selected
      const imageUrl = await uploadProfileImage();
      
      // Prepare update data
      const updateData = {
        ...formData,
        ...(imageUrl && { profilePicture: imageUrl })
      };

      // Update Firestore document
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, updateData);

      // Update local state
      setProfile(prev => ({
        ...prev,
        ...updateData
      }));

      // Exit editing mode
      setEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  // Render profile image
  const renderProfileImage = () => {
    if (imagePreview) return imagePreview;
    if (profile?.profilePicture) return profile.profilePicture;
    return null;
  };

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="profile-card"
          >
            {/* Header */}
            <div className="profile-header">
              <h2>{setup ? 'Complete Your Profile' : 'Your Profile'}</h2>
              {!setup && !editing && (
                <button 
                  className="edit-btn" 
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>

            {/* Profile Content */}
            {editing ? (
              <form onSubmit={handleSaveProfile} className="profile-edit-form">
                {/* Profile Image Upload */}
                <div className="profile-image-upload">
                  <input 
                    type="file" 
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="profile-image-input"
                  />
                  <label htmlFor="profileImage" className="profile-image-label">
                    {renderProfileImage() ? (
                      <img 
                        src={renderProfileImage()} 
                        alt="Profile" 
                        className="profile-image-preview"
                      />
                    ) : (
                      <div className="profile-image-placeholder">
                        <span>Upload Photo</span>
                      </div>
                    )}
                  </label>
                </div>

                {/* Edit Form Fields */}
                <div className="profile-form-fields">
                  <div className="form-row">
                    <input 
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                    <input 
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <input 
                    type="text"
                    name="jobTitle"
                    placeholder="Job Title"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                  />
                  <textarea 
                    name="bio"
                    placeholder="Tell us about yourself"
                    value={formData.bio}
                    onChange={handleInputChange}
                  />
                  <button type="submit" className="save-profile-btn">
                    Save Profile
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-view">
                {/* Profile View Mode */}
                <div className="profile-image">
                  {profile?.profilePicture ? (
                    <img 
                      src={profile.profilePicture} 
                      alt="Profile" 
                    />
                  ) : (
                    <div className="profile-image-placeholder">
                      <span>No Photo</span>
                    </div>
                  )}
                </div>
                <div className="profile-details">
                  <h3>{profile?.firstName} {profile?.lastName}</h3>
                  <p className="job-title">{profile?.jobTitle || 'Job Title Not Set'}</p>
                  <p className="bio">{profile?.bio || 'No bio available'}</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;
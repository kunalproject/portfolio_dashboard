import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './Dashboard.module.css';
import { PortfolioContext } from '../../PortfolioContext';
const Dashboard = () => {
  
  const { userData, setUserData } = useContext(PortfolioContext);
  const [formData, setFormData] = useState({
    name: '',
    about: '',
    resume: '',
    email: '',
    leetcode_id: '',
    gfg_id: '',
    linkedin: '',
    github: '',
    instagram: '',
    twitter: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState({
    profilePic: false,
    name: false,
    about: false,
    resume: false,
    portfolio: false,
    email: false,
    leetcode_id: false,
    gfg_id: false,
    linkedin: false,
    github: false,
    instagram: false,
    twitter: false
  });
  const navigate = useNavigate();

  // Verify authentication and get user data
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/portfolio/protected-route`, {
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({}),
          withCredentials: true
        });
        console.log('response from dashboard', response);
        setUserData(response.data.user);
        setFormData({
          name: response.data.user.name || '',
          about: response.data.user.about || '',
          resume: response.data.user.resume || '',
          email: response.data.user.email || '',
          leetcode_id: response.data.user.leetcode_id || '',
          gfg_id: response.data.user.gfg_id || '',
          linkedin: response.data.user.linkedin || '',
          github: response.data.user.github || '',
          instagram: response.data.user.instagram || '',
          twitter: response.data.user.twitter || ''
        });
        if (response.data.user.profilePic) {
          setPreviewUrl(response.data.user.profilePic);
        }
      } catch (error) {
        console.log('error from dashboard', error);
        toast.error('Authentication failed');
        navigate('/login');
      }
    };
    verifyAuth();
  }, [navigate, setUserData]);

  // Create preview for selected image
  useEffect(() => {
    if (!selectedFile) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(selectedFile);
  }, [selectedFile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleProfilePicUpdate = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }
const fileSizeInMB = selectedFile.size / (1024 * 1024);

if (fileSizeInMB > 2) {
  toast.error('File size should be less than 2MB');
  return;
}
    setIsLoading(prev => ({ ...prev, profilePic: true }));
    try {
      const formData = new FormData();
      formData.append('profilePic', selectedFile);

      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/portfolio/update_profilePic`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setUserData(prev => ({ ...prev, profilePic: response.data.imageUrl }));
      toast.success(response.data.message);
      setSelectedFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setIsLoading(prev => ({ ...prev, profilePic: false }));
    }
  };

  const handleFieldUpdate = async (field) => {
    if (!formData[field]) {
      toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
      return;
    }

    setIsLoading(prev => ({ ...prev, [field]: true }));
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/portfolio/update_${field}`,
        { [field]: formData[field] },
        { withCredentials: true }
      );
      setUserData(prev => ({ ...prev, [field]: formData[field] }));
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to update ${field}`);
    } finally {
      setIsLoading(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleSocialUpdate = async (field) => {
    if (formData[field] === null || formData[field] === undefined) {
      toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
      return;
    }

    setIsLoading(prev => ({ ...prev, [field]: true }));
    try {
      console.log(`${process.env.REACT_APP_BASE_URL}/portfolio/update_${field}`, { [field]: formData[field] }, { withCredentials: true });
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/portfolio/update_${field}`,
        { [field]: formData[field] },
        { withCredentials: true }
      );
      setUserData(prev => ({ ...prev, [field]: formData[field] }));
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to update ${field}`);
    } finally {
      setIsLoading(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleDeletePortfolio = async () => {
    setIsLoading(prev => ({ ...prev, portfolio: true }));
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/portfolio/delete_portfolio`,
        { withCredentials: true }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete portfolio');
    } finally {
      setIsLoading(prev => ({ ...prev, portfolio: false }));
    }
  };
  // Corrected update function for coding profiles
  const handleCodingProfileUpdate = async (field) => {
    const value = formData[field];
    if (!value) {
      toast.error(`${field.replace('_', ' ')} is required`);
      return;
    }

    setIsLoading(prev => ({ ...prev, [field]: true }));
    
    try {
      // Note the endpoint matches your backend route
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/portfolio/update_${field}`,
        { [field]: value },
        { withCredentials: true }
      );
      
      // Update both context and local form data
      setUserData(prev => ({ ...prev, [field]: value }));
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to update ${field.replace('_', ' ')}`);
    } finally {
      setIsLoading(prev => ({ ...prev, [field]: false }));
    }
  };
  if (!userData) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Profile Dashboard</h1>
      
      {/* Profile Picture Section */}
      <div className={styles.section}>
        <h2>Profile Picture</h2>
        <div className={styles.profileSection}>
          <div className={styles.imageContainer}>
            <img 
              src={previewUrl || '/default-profile.png'} 
              alt="Profile preview" 
              className={styles.profileImage}
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = '/default-profile.png'
              }}
            />
          </div>
          <div className={styles.uploadControls}>
            <input
              type="file"
              id="profilePicUpload"
              onChange={handleFileChange}
              accept="image/*"
              className={styles.fileInput}
            />
            <label htmlFor="profilePicUpload" className={styles.fileInputLabel}>
              Choose Image
            </label>
            {selectedFile && (
              <button 
                onClick={handleProfilePicUpdate}
                className={styles.uploadButton}
                disabled={isLoading.profilePic}
              >
                {isLoading.profilePic ? 'Uploading...' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Basic Info Sections */}
      <div className={styles.section}>
        <h2>Name</h2>
        <div className={styles.inputGroup}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={styles.inputField}
            placeholder="Enter your full name"
          />
          <button 
            onClick={() => handleFieldUpdate('name')}
            className={styles.updateButton}
            disabled={!formData.name || isLoading.name}
          >
            {isLoading.name ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h2>About</h2>
        <div className={styles.textareaGroup}>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleInputChange}
            className={styles.textarea}
            placeholder="Tell something about yourself"
            rows="5"
          />
          <button 
            onClick={() => handleFieldUpdate('about')}
            className={styles.updateButton}
            disabled={!formData.about || isLoading.about}
          >
            {isLoading.about ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Resume URL</h2>
        <div className={styles.inputGroup}>
          <input
            type="url"
            name="resume"
            value={formData.resume}
            onChange={handleInputChange}
            className={styles.inputField}
            placeholder="https://example.com/my-resume.pdf"
          />
          <button 
            onClick={() => handleFieldUpdate('resume')}
            className={styles.updateButton}
            disabled={!formData.resume || isLoading.resume}
          >
            {isLoading.resume ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>

      {/* Email Section
      <div className={styles.section}>
        <h2>Email</h2>
        <div className={styles.inputGroup}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={styles.inputField}
            placeholder="your.email@example.com"
          />
          <button 
            onClick={() => handleSocialUpdate('email')}
            className={styles.updateButton}
            disabled={!formData.email || isLoading.email}
          >
            {isLoading.email ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div> */}

      {/* Coding Profiles Section */}
      <div className={styles.section}>
        <h2>Coding Profiles</h2>
        <div className={styles.gridContainer}>
          {/* LeetCode */}
          <div className={styles.inputGroup}>
            <label>LeetCode ID</label>
            <input
              type="text"
              name="leetcode_id"
              value={formData.leetcode_id}
              onChange={handleInputChange}
              className={styles.inputField}
              placeholder="leetcode_username"
            />
            <button 
              onClick={() => handleCodingProfileUpdate('leetcode_id')}
              className={styles.updateButton}
              disabled={!formData.leetcode_id || isLoading.leetcode_id}
            >
              {isLoading.leetcode_id ? 'Updating...' : 'Update'}
            </button>
          </div>

          {/* GeeksforGeeks */}
          <div className={styles.inputGroup}>
            <label>GFG ID</label>
            <input
              type="text"
              name="gfg_id"
              value={formData.gfg_id}
              onChange={handleInputChange}
              className={styles.inputField}
              placeholder="gfg_username"
            />
            <button 
              onClick={() => handleCodingProfileUpdate('gfg_id')}
              className={styles.updateButton}
              disabled={!formData.gfg_id || isLoading.gfg_id}
            >
              {isLoading.gfg_id ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>
      </div>
      {/* Social Media Section */}
      <div className={styles.section}>
        <h2>Social Media</h2>
        <div className={styles.gridContainer}>
          <div className={styles.inputGroup}>
            <label>LinkedIn URL</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              className={styles.inputField}
              placeholder="https://linkedin.com/in/username"
            />
            <button 
              onClick={() => handleSocialUpdate('linkedin')}
              className={styles.updateButton}
              disabled={!formData.linkedin || isLoading.linkedin}
            >
              {isLoading.linkedin ? 'Updating...' : 'Update'}
            </button>
          </div>

          <div className={styles.inputGroup}>
            <label>GitHub URL</label>
            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleInputChange}
              className={styles.inputField}
              placeholder="https://github.com/username"
            />
            <button 
              onClick={() => handleSocialUpdate('github')}
              className={styles.updateButton}
              disabled={!formData.github || isLoading.github}
            >
              {isLoading.github ? 'Updating...' : 'Update'}
            </button>
          </div>

          <div className={styles.inputGroup}>
            <label>Instagram</label>
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleInputChange}
              className={styles.inputField}
              placeholder="@username"
            />
            <button 
              onClick={() => handleSocialUpdate('instagram')}
              className={styles.updateButton}
              disabled={!formData.instagram || isLoading.instagram}
            >
              {isLoading.instagram ? 'Updating...' : 'Update'}
            </button>
          </div>

          <div className={styles.inputGroup}>
            <label>Twitter</label>
            <input
              type="text"
              name="twitter"
              value={formData.twitter}
              onChange={handleInputChange}
              className={styles.inputField}
              placeholder="@username"
            />
            <button 
              onClick={() => handleSocialUpdate('twitter')}
              className={styles.updateButton}
              disabled={!formData.twitter || isLoading.twitter}
            >
              {isLoading.twitter ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className={styles.section}>
        <h2>Sections</h2>
        <div className={styles.sectionButtons}>
          <button onClick={() => navigate('/dashboard/skills')} className={styles.sectionButton}>
            Manage Skills
          </button>
          <button onClick={() => navigate('/dashboard/projects')} className={styles.sectionButton}>
            Manage Projects
          </button>
          <button onClick={() => navigate('/dashboard/experiences')} className={styles.sectionButton}>
            Manage Experiences
          </button>
          <button onClick={() => navigate('/dashboard/educations')} className={styles.sectionButton}>
            Manage Educations
          </button>
        </div>
      </div>
      {/* Message Section */}
      <div className={styles.section}>  
        <h2>Message</h2>
        <div className={styles.sectionButtons}>
          <button onClick={() => navigate('/dashboard/messages')} className={styles.sectionButton}>
            View Messages
          </button>
        </div>
      </div>
      {/* Portfolio Management */}
      <div className={styles.section}>
        <h2>Portfolio Management</h2>
        <button 
          onClick={handleDeletePortfolio}
          className={styles.dangerButton}
          disabled={isLoading.portfolio}
        >
          {isLoading.portfolio ? 'Processing...' : 'Delete Portfolio'}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './Experience.module.css';
import { PortfolioContext } from '../../PortfolioContext';

const ExperienceSection = () => {
  const { userData, setUserData } = useContext(PortfolioContext);
  const [newExperience, setNewExperience] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
    imageUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExperience(prev => ({ ...prev, [name]: value }));
  };

  const handleAddExperience = async () => {
    if (!newExperience.company || !newExperience.position || !newExperience.startDate || !newExperience.description) {
      toast.error('Company, Position, Start Date and Description are required');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/portfolio/add_experience`,
        newExperience,
        { withCredentials: true }
      );
      
      setUserData(prev => ({
        ...prev,
        experience: [...prev.experience, newExperience]
      }));
      setNewExperience({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
        imageUrl: ''
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add experience');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExperience = async (index) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/portfolio/delete_experience`,
        { 
          withCredentials: true,
          data: { index }
        }
      );
      setUserData(prev => ({
        ...prev,
        experience: prev.experience.filter((_, i) => i !== index)
      }));
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete experience');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles.section}>
      <h2>Experience</h2>
      <div className={styles.itemsContainer}>
        {userData.experience?.map((exp, index) => (
          <div key={index} className={styles.itemCard}>
            <h3>{exp.position} at {exp.company}</h3>
            <p>{exp.startDate} - {exp.endDate || 'Present'}</p>
            <p>{exp.description}</p>
            <button 
              onClick={() => handleDeleteExperience(index)}
              className={styles.deleteButton}
              disabled={isLoading}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <div className={styles.formGroup}>
        <input
          type="text"
          name="company"
          value={newExperience.company}
          onChange={handleInputChange}
          className={styles.inputField}
          placeholder="Company Name"
          disabled={isLoading}
          required
        />
        <input
          type="text"
          name="position"
          value={newExperience.position}
          onChange={handleInputChange}
          className={styles.inputField}
          placeholder="Position/Role"
          disabled={isLoading}
          required
        />
        <div className={styles.dateGroup}>
          <label className={styles.dateLabel}>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={newExperience.startDate}
            onChange={handleInputChange}
            className={styles.inputField}
            placeholder="Start Date"
            disabled={isLoading}
            required
          />
          <label className={styles.dateLabel}>End Date: if still studying then leave empty</label>
          <input
            type="date"
            name="endDate"
            value={newExperience.endDate}
            onChange={handleInputChange}
            className={styles.inputField}
            placeholder="End Date (leave empty if current)"
            disabled={isLoading}
          />
        </div>
        <textarea
          name="description"
          value={newExperience.description}
          onChange={handleInputChange}
          className={styles.textarea}
          placeholder="Job Description"
          rows="3"
          disabled={isLoading}
          required
        />
        <input
          type="text"
          name="imageUrl"
          value={newExperience.imageUrl}
          onChange={handleInputChange}
          className={styles.inputField}
          placeholder="Company Logo URL (optional)"
          disabled={isLoading}
        />
        <button 
          onClick={handleAddExperience}
          className={styles.addButton}
          disabled={!newExperience.company || !newExperience.position || 
                   !newExperience.startDate || !newExperience.description || isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Experience'}
        </button>
      </div>
    </div>
  );
};

export default ExperienceSection;
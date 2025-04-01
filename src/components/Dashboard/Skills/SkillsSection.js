import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './Skills.module.css';
import { useContext } from 'react';
import { PortfolioContext } from '../../../PortfolioContext';

const SkillsSection = () => {
    const { userData, setUserData } = useContext(PortfolioContext);
  const [newSkill, setNewSkill] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddSkill = async () => {
    if (!newSkill.trim()) {
      toast.error('Skill cannot be empty');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/portfolio/add_skill`,
        { skill: newSkill },
        { withCredentials: true }
      );
      setUserData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }));
      setNewSkill('');
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add skill');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSkill = async (skill) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/portfolio/delete_skill`,
        { 
          withCredentials: true,
          data: { skill }
        }
      );
      setUserData(prev => ({
        ...prev,
        skills: prev.skills.filter(s => s !== skill)
      }));
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove skill');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.section}>
      <h2>Skills</h2>
      <div className={styles.skillsContainer}>
        {userData.skills?.map((skill, index) => (
          <div key={index} className={styles.skillItem}>
            <span>{skill}</span>
            <button 
              onClick={() => handleDeleteSkill(skill)}
              className={styles.deleteButton}
              disabled={isLoading}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className={styles.inputGroup}>
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          className={styles.inputField}
          placeholder="Add new skill"
          disabled={isLoading}
        />
        <button 
          onClick={handleAddSkill}
          className={styles.addButton}
          disabled={!newSkill.trim() || isLoading}
        >
          {isLoading ? 'Adding...' : 'Add'}
        </button>
      </div>
    </div>
  );
};

export default SkillsSection;
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './Education.module.css';
import { PortfolioContext } from '../../PortfolioContext';

const EducationSection = () => {
  const { userData, setUserData } = useContext(PortfolioContext);
  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    startDate: '',
    endDate: '',
    marks: '',
    imageUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEducation(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEducation = async () => {
    if (!newEducation.institution || !newEducation.degree || !newEducation.startDate) {
      toast.error('Institution, Degree and Start Date are required');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/portfolio/add_education`,
        newEducation,
        { withCredentials: true }
      );
      
      setUserData(prev => ({
        ...prev,
        education: [...prev.education, newEducation]
      }));
      setNewEducation({
        institution: '',
        degree: '',
        startDate: '',
        endDate: '',
        marks: '',
        imageUrl: ''
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add education');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEducation = async (index) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/portfolio/delete_education`,
        { 
          withCredentials: true,
          data: { index }
        }
      );
      setUserData(prev => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== index)
      }));
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete education');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles.section}>
      <h2>Education</h2>
      <div className={styles.itemsContainer}>
        {userData.education?.map((edu, index) => (
          <div key={index} className={styles.itemCard}>
            <h3>{edu.degree} at {edu.institution}</h3>
            <p>{edu.startDate} - {edu.endDate || 'Present'}</p>
            {edu.marks && <p>Marks/GPA: {edu.marks}</p>}
            <button 
              onClick={() => handleDeleteEducation(index)}
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
          name="institution"
          value={newEducation.institution}
          onChange={handleInputChange}
          className={styles.inputField}
          placeholder="Institution Name"
          disabled={isLoading}
          required
        />
        <input
          type="text"
          name="degree"
          value={newEducation.degree}
          onChange={handleInputChange}
          className={styles.inputField}
          placeholder="Degree/Certificate"
          disabled={isLoading}
          required
        />
        <label className={styles.dateLabel}>Start Date:</label>
        <div className={styles.dateGroup}>
          <input
            type="date"
            name="startDate"
            value={newEducation.startDate}
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
            value={newEducation.endDate}
            onChange={handleInputChange}
            className={styles.inputField}
            placeholder="End Date (leave empty if current)"
            disabled={isLoading}
          />
        </div>
        <input
          type="text"
          name="marks"
          value={newEducation.marks}
          onChange={handleInputChange}
          className={styles.inputField}
          placeholder="Marks/GPA (optional)"
          disabled={isLoading}
        />
        <input
          type="text"
          name="imageUrl"
          value={newEducation.imageUrl}
          onChange={handleInputChange}
          className={styles.inputField}
          placeholder="Institution Logo URL (optional)"
          disabled={isLoading}
        />
        <button 
          onClick={handleAddEducation}
          className={styles.addButton}
          disabled={!newEducation.institution || !newEducation.degree || 
                   !newEducation.startDate || isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Education'}
        </button>
      </div>
    </div>
  );
};

export default EducationSection;
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './Project.module.css';
import { useContext } from 'react';
import { PortfolioContext } from '../../PortfolioContext';
const ProjectsSection = () => {
    const { userData, setUserData } = useContext(PortfolioContext);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    imageUrl: '',
    link: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.description) {
      toast.error('Title and description are required');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/portfolio/add_project`,
        newProject,
        { withCredentials: true }
      );
      
      setUserData(prev => ({
        ...prev,
        projects: [...prev.projects, newProject]
      }));
      setNewProject({
        title: '',
        description: '',
        imageUrl: '',
        link: ''
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (index) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/portfolio/delete_project`,
        { 
          withCredentials: true,
          data: { index }
        }
      );
      setUserData(prev => ({
        ...prev,
        projects: prev.projects.filter((_, i) => i !== index)
      }));
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete project');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles.section}>
      <h2>Projects</h2>
      <div className={styles.itemsContainer}>
        {userData.projects?.map((project, index) => (
          <div key={index} className={styles.itemCard}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer">View Project</a>}
            <button 
              onClick={() => handleDeleteProject(index)}
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
          name="title"
          value={newProject.title}
          onChange={handleInputChange}
          className={styles.inputField}
          placeholder="Project Title"
          disabled={isLoading}
        />
        <textarea
          name="description"
          value={newProject.description}
          onChange={handleInputChange}
          className={styles.textarea}
          placeholder="Project Description"
          rows="3"
          disabled={isLoading}
        />
        <input
          type="text"
          name="imageUrl"
          value={newProject.imageUrl}
          onChange={handleInputChange}
          className={styles.inputField}
          placeholder="Image URL (optional)"
          disabled={isLoading}
        />
        <input
          type="text"
          name="link"
          value={newProject.link}
          onChange={handleInputChange}
          className={styles.inputField}
          placeholder="Project URL (optional)"
          disabled={isLoading}
        />
        <button 
          onClick={handleAddProject}
          className={styles.addButton}
          disabled={!newProject.title || !newProject.description || isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Project'}
        </button>
      </div>
    </div>
  );
};

export default ProjectsSection;

import React from 'react';
import Signup from './components/signup/Signup';
import Home from './components/Home/Home';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import ProfileForm from './components/Dashboard/Dashboard'
import SkillsSection from './components/Dashboard/Skills/SkillsSection';
import ProjectsSection from './components/Dashboard/ProjectsSection';
import ExperienceSection from './components/Dashboard/ExperienceSection';
import EducationSection from './components/Dashboard/EducationSection';
import { PortfolioContext } from './PortfolioContext';
import Message from './components/Dashboard/Message';
import { useContext } from 'react';
import Spinner from './components/Spinner';
function App() {
  const{loading} = useContext(PortfolioContext);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <Home />} />
        <Route path="/signup" element={ <Signup />} />
        <Route path="/login" element={<Login/>} />
        <Route path='/dashboard' element={<ProfileForm/>} />
        <Route path='/dashboard/skills' element={<SkillsSection/>} />
        <Route path='/dashboard/projects' element={<ProjectsSection/>} />
        <Route path='/dashboard/experiences' element={<ExperienceSection/>} />
        <Route path='/dashboard/educations' element={<EducationSection/>} />
        <Route path='/dashboard/messages' element={<Message/>} />
      </Routes>
    </div>
  );
}

export default App;

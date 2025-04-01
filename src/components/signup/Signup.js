import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Signup.module.css';
import { toast } from 'react-toastify';
import { PortfolioContext } from '../../PortfolioContext';
import { useContext } from 'react';
const Signup = () => {
  const {setLoading,loading} = useContext(PortfolioContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/person/signup`,
        { name, email, password },
        { withCredentials: true }
      );
      setLoading(false);
      if (response.status === 201) {
        toast.success("Signed up successfully!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        
        setSuccessMessage(`A confirmation email with your portfolio link has been sent to ${email}`);
        
          setTimeout(() => {
            navigate('/dashboard');
          }, 4000);
       ; // Give user time to read the message
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className={styles.signupContainer}>
      <h1 className={styles.title}>Create Account</h1>
      {error && <p className={styles.error}>{error}</p>}
      {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
        <div className={styles.passwordInputContainer}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.passwordInput}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={styles.toggleButton}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
        <button type="submit" className={styles.submitButton}>
         {loading ? "Signing Up..." : "Sign Up"}
        </button>
        <p className={styles.loginLink}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
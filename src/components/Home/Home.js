import React from 'react'
import styles from "./Home.module.css";
import axios from 'axios';
const Home = () => {
  return (
    <div className={styles.app}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <h1>Create Your Portfolio in Minutes</h1>
        <p>
          Fill out a simple form, and we'll generate a stunning portfolio website
          for you.
        </p>
        <a
          href={"/signup"} // Replace with your form link
          target="_main"
          rel="noopener noreferrer"
          className={styles.ctaButton}
        >
          Get Started
        </a>
      </div>

      {/* Features Section */}
      <div className={styles.features}>
        <h2>Why Choose Us?</h2>
        <div className={styles.featureList}>
          <div className={styles.featureItem}>
            <h3>Easy to Use</h3>
            <p>Fill out a simple form, and your portfolio is ready.</p>
          </div>
          <div className={styles.featureItem}>
            <h3>Customizable</h3>
            <p>Choose from multiple templates and themes.</p>
          </div>
          <div className={styles.featureItem}>
            <h3>Free</h3>
            <p>Generate your portfolio website for free.</p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className={styles.footer}>
        <p>© {new Date().getFullYear()} Portfolio Generator. All rights reserved.</p>
        <p>
          <a href="/privacy-policy">Privacy Policy</a> |{" "}
          <a href="/terms-of-service">Terms of Service</a>
        </p>
      </div>
    </div>
  );

}
/******  4b173e68-aee6-43a0-95bb-92057c86cd33  *******/

export default Home

import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom';
import TextType from './Components/TextType.jsx';
import OrbBackground from './Components/OrbBackground.jsx';
import Admin from "./Components/Admin.jsx";
import ContactForm from "./Components/ContactForm.jsx";
import AuroraShader from './Background/AuroraShader.tsx';
import Loader from './Components/Loader.jsx'
import './Style/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const headingRef = useRef(null);
  const [headingVisible, setHeadingVisible] = useState(false);
  const [loading, setLoading] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeadingVisible(true);
        } else {
          setHeadingVisible(false);
        }
      },
      { threshold: 0.1 }
    );
    if (headingRef.current) {
      observer.observe(headingRef.current);
    }
    return () => observer.disconnect();
  }, []);
  if (loading) {
    return <Loader />;
  }
  const handleGetStarted = () => {
    setLoading(true)
    setTimeout(() => navigate('./Generator'), 800)
  }
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="homepage"
      >
        <div className='bg'>
          <AuroraShader />
          <div className="homepage-container">
            <OrbBackground />
            <nav className="homepage-nav">
              <div className="nav-left">IdeaStone <i className="bi bi-strava"></i></div>

              <div className="hamburger-wrapper">
                <div className="hamburger">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="nav-menu">
                  <Link to="/About" className="nav-link">About</Link>
                  <Link to="/showcase" className="nav-link">Project Showcase</Link>
                  <Link to="/support" className="nav-link">Get Help</Link>
                </div>
              </div>
            </nav>

            <div className="homepage-overlay">
              <header className="homepage-header">
                <h1 className="homepage-animated-text">
                  <TextType
                    text={[
                      "     Welcome to IdeaStone :)",
                      "     Your capstone starts here...",
                      "     Let's build something brilliant!!"
                    ]}
                    typingSpeed={75}
                    pauseDuration={1500}
                    showCursor={true}
                    cursorCharacter="|"
                    className="typing-text"
                    cursorClassName="cursor"
                  />
                </h1>
                <h1 className="homepage-title">
                  <i className="bi bi-strava"></i> IdeaStone <i className="bi bi-strava"></i>
                </h1>

                <p className="homepage-subtext">
                  Start your capstone with Levi's IdeaStone.
                </p>
              </header>

              <div className="homepage-button-group">
                <button onClick={handleGetStarted} className="homepage-button" >
                  Get Started
                </button>
                <button
                  onClick={() => navigate('')}
                  className="homepage-button">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* University Partnership Section */}
      <section className="university-section">
        <div className="university-container">
          <motion.div
            className="university-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="university-background-elements">
              <div className="uni-orb uni-1"></div>
              <div className="uni-orb uni-2"></div>
            </div>

            <div className="university-content">
              <motion.div
                className="university-badge"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <i className="bi bi-award"></i>
              </motion.div>

              <motion.h2
                className="university-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Developed at Trinidad Municipal College
              </motion.h2>

              <motion.div
                className="university-logo-container"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <div className="university-logo">

                  <div className="logo-image-container">
                    <img
                      src="src/assets/tmc_logo.png"
                      alt="Trinidad Municipal College Logo"
                      className="college-logo"
                    />
                  </div>
                  <div className="logo-text">
                    <span>Trinidad Municipal College</span>
                  </div>
                </div>
              </motion.div>

              <motion.p
                className="university-description"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                Proudly developed and academically endorsed by <strong>Trinidad Municipal College</strong>.
                This platform represents our commitment to innovative education and student success in capstone project development.
              </motion.p>

              <motion.div
                className="partnership-features"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <div className="partnership-feature">
                  <i className="bi bi-patch-check"></i>
                  <span>College-Developed</span>
                </div>
                <div className="partnership-feature">
                  <i className="bi bi-mortarboard"></i>
                  <span>Academic Excellence</span>
                </div>
                <div className="partnership-feature">
                  <i className="bi bi-shield-check"></i>
                  <span>Quality Assured</span>
                </div>
              </motion.div>

              <motion.div
                className="college-mission"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <p>
                  <i className="bi bi-quote"></i>
                  Empowering students through innovative technology and practical education.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Admin />

      <section className="chat-area-section">
        <div className="chat-area-container">
          <motion.div
            className="chat-area-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut"
            }}
            viewport={{ once: true }}
          >
            <div className="chat-background-elements">
              <div className="floating-orb orb-1"></div>
              <div className="floating-orb orb-2"></div>
              <div className="floating-orb orb-3"></div>
            </div>
            <motion.div
              className="chat-content-wrapper"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >

              <div className="chat-header">
                <motion.h2
                  className="chat-title"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  Need Capstone Help? Let's Chat!
                </motion.h2>
              </div>

              <motion.p
                className="chat-description"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                Ready to bring your capstone project to life? Whether you need technical guidance,
                want to brainstorm ideas, or just have questions about your project - I'm here to help!
                Let's build something amazing together. Click the button below to start a conversation.
              </motion.p>

              <motion.div
                className="features-grid"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <div className="feature-card">
                  <div className="feature-icon">
                    <i className="bi bi-lightning-charge"></i>
                  </div>
                  <h4>Quick Response</h4>
                  <p>Get answers within hours</p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">
                    <i className="bi bi-code-square"></i>
                  </div>
                  <h4>Technical Support</h4>
                  <p>Expert development guidance</p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">
                    <i className="bi bi-lightbulb"></i>
                  </div>
                  <h4>Personal Support</h4>
                  <p>One-on-one help from IdeaStone Developer's</p>
                </div>
              </motion.div>

              <motion.div
                className="chat-cta"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <motion.button
                  className="chat-action-btn"
                  onClick={() => setIsContactOpen(true)}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 30px rgba(76, 201, 240, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="bi bi-send-arrow-up"></i>
                  Start Conversation
                  <div className="btn-shine"></div>
                </motion.button>

                <p className="cta-subtext">
                  Have questions before reaching out? Check our <a href="/docs">Portfolio</a> for more info.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      <ContactForm
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Logo Loop Section */}
      <section className="logo-loop-section">
        <div className="logo-loop-container">
          <motion.div
            className="logo-loop-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="logo-loop-content">
              <motion.h2
                className="logo-loop-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Trusted by Students From
              </motion.h2>

              <motion.p
                className="logo-loop-subtitle"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Join students from leading institutions who use IdeaStone for their capstone projects.
              </motion.p>

              {/* Logo Marquee Container */}
              <div className="logo-marquee">
                <div className="logo-track">
                  <div className="logo-item">
                    <div className="logo-wrapper">
                      <img src="src/assets/tmc_logo.png" alt="Trinidad Municipal College" className="logo-loop-image" />
                      <span>Trinidad Municipal College</span>
                    </div>
                  </div>
                  <div className="logo-item">
                    <div className="logo-wrapper">
                      <i className="bi bi-building"></i>
                      <span>Stanford</span>
                    </div>
                  </div>
                  <div className="logo-item">
                    <div className="logo-wrapper">
                      <i className="bi bi-building"></i>
                      <span>MIT</span>
                    </div>
                  </div>
                  <div className="logo-item">
                    <div className="logo-wrapper">
                      <i className="bi bi-building"></i>
                      <span>UC Berkeley</span>
                    </div>
                  </div>
                  <div className="logo-item">
                    <div className="logo-wrapper">
                      <i className="bi bi-building"></i>
                      <span>Carnegie Mellon</span>
                    </div>
                  </div>
                  <div className="logo-item">
                    <div className="logo-wrapper">
                      <i className="bi bi-building"></i>
                      <span>University of Toronto</span>
                    </div>
                  </div>


                  <div className="logo-item">
                    <div className="logo-wrapper">
                      <img src="src/assets/tmc_logo.png" alt="Trinidad Municipal College" className="logo-loop-image" />
                      <span>Trinidad Municipal College</span>
                    </div>
                  </div>
                  <div className="logo-item">
                    <div className="logo-wrapper">
                      <i className="bi bi-building"></i>
                      <span>Stanford</span>
                    </div>
                  </div>
                  <div className="logo-item">
                    <div className="logo-wrapper">
                      <i className="bi bi-building"></i>
                      <span>MIT</span>
                    </div>
                  </div>
                  <div className="logo-item">
                    <div className="logo-wrapper">
                      <i className="bi bi-building"></i>
                      <span>UC Berkeley</span>
                    </div>
                  </div>
                  <div className="logo-item">
                    <div className="logo-wrapper">
                      <i className="bi bi-building"></i>
                      <span>Carnegie Mellon</span>
                    </div>
                  </div>
                  <div className="logo-item">
                    <div className="logo-wrapper">
                      <i className="bi bi-building"></i>
                      <span>University of Toronto</span>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                className="logo-loop-cta"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <p>Your university could be next!</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
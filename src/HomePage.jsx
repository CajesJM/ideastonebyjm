import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion'
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
                  <a href="/" className="nav-link">About</a>
                  <a href="/docs" className="nav-link">Portfolio</a>
                  <a href="/" className="nav-link">Contact&nbsp;&nbsp;Us</a>
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
                <motion.div
                  className="chat-icon-wrapper"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{
                    delay: 0.4,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  <i className="bi bi-chat-heart"></i>
                </motion.div>

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
                  <h4>Idea Refinement</h4>
                  <p>Polish your project concepts</p>
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
    </div>
  );
};

export default HomePage;
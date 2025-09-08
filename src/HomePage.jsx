import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {motion } from 'framer-motion'
import TextType from './Components/TextType.jsx';
import OrbBackground from './Components/OrbBackground.jsx';
import Admin from "./Components/Admin.jsx";
import AuroraShader from './Background/AuroraShader.tsx'; 
import Loader from './Components/Loader.jsx'
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const headingRef = useRef(null);
  const [headingVisible, setHeadingVisible] = useState(false);
  const [loading, setLoading] = useState(false)

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
    const handleGetStarted = () =>{
      setLoading(true)
      setTimeout(()=> navigate('./Generator'), 800)
    }
  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="homepage"
    >
    <div className='bg'>
      <AuroraShader/>
      <div className="homepage-container">
        <OrbBackground />
        <nav className="homepage-nav">
      <div className="nav-left">IdeaStone</div>

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
              IdeaStone
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
                      Learn More
          </button>
          </div>
          </div>
          </div>
          </div>
      </motion.div>
       
           <h1 style={{color: 'white', marginTop: '35px'}}
       ref={headingRef}
      className={`heading ${headingVisible ? 'visible' : ''}` }>
        Developers
          </h1>
              
          <Admin/>
          <Admin/>
          <Admin/>
          <Admin/>
          <Admin/>
          <Admin/>
    </>
  );
};

export default HomePage;
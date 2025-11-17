import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useSubscription, SUBSCRIPTION_PLANS } from './Context/SubscriptionContext';
import SubscriptionModal from './Components/SubscriptionModal';
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom';
import TextType from './Components/TextType.jsx';
import OrbBackground from './Components/OrbBackground.jsx';
import Admin from "./Components/Admin.jsx";
import ContactForm from "./Components/ContactForm.jsx";
import AuroraShader from './Background/AuroraShader.tsx';
import Loader from './Components/Loader.jsx';
import Login from './Components/Login.jsx';
import './Style/HomePage.css';

const HomePage = ({ auth }) => {
  const navigate = useNavigate();
  const headingRef = useRef(null);
  const [headingVisible, setHeadingVisible] = useState(false);
  const [loading, setLoading] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAtUniversitySection, setIsAtUniversitySection] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const { user, login, logout, createDemoUser, isAuthenticated, isLoading: authLoading } = auth;

  const {
    getRemainingGenerations,
    isSubscribed,
    generationCount,
    currentPlan,
    isFreePlan,
    canGenerate,
    canGenerateNow,
    remainingGenerations,
    hasNoPlan,
    subscribe
  } = useSubscription();

  useEffect(() => {
    console.log('HomePage Subscription State:', {
      hasNoPlan,
      isSubscribed,
      currentPlan: currentPlan?.name,
      isFreePlan,
      generationCount,
      remaining: getRemainingGenerations(),
      canGenerate: canGenerateNow,
      isAuthenticated,
      user: user?.email
    });
  }, [hasNoPlan, isSubscribed, currentPlan, isFreePlan, generationCount, getRemainingGenerations, canGenerateNow, isAuthenticated, user]);

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

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      setIsScrolled(scrollTop > 100);
      setIsAtUniversitySection(scrollTop > 950);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return <Loader />;
  }

  const handleSubscribe = () => {
    setIsSubscriptionOpen(true);
  };

  const handleActivateFreePlan = () => {
    subscribe(SUBSCRIPTION_PLANS.FREE);
  };

  const handleGetStarted = () => {

    if (!isAuthenticated) {
      const useDemo = confirm('🎭 Welcome to IdeaStone! Would you like to try demo mode first, or sign in to save your progress? \n\nClick OK for Demo Mode\nClick Cancel to stay in Guest Mode');
      if (useDemo) {
        createDemoUser();
      }
      return;
    }

    if (hasNoPlan) {
      setIsSubscriptionOpen(true);
      return;
    }
    if (!canGenerateNow) {
      setIsSubscriptionOpen(true);
      return;
    }

    setLoading(true);
    setTimeout(() => navigate('./Generator'), 800);
  };

  const getPlanDisplayName = () => {
    if (hasNoPlan) return 'No Plan';
    if (currentPlan?.type === 'free') return 'Free';
    if (currentPlan?.type === 'starter') return 'Starter';
    if (currentPlan?.type === 'pro') return 'Pro';
    if (currentPlan?.type === 'unlimited') return 'Unlimited';
    return 'Premium';
  };

  const getSubscribeButtonText = () => {
    if (hasNoPlan) return 'Get Free Plan';
    if (!isSubscribed) return 'Upgrade Now';
    if (currentPlan?.type === 'unlimited') return 'Manage Plan';
    return 'Upgrade Plan';
  };

  const getSubtitleText = () => {
    if (!isAuthenticated) {
      return "Try demo mode or sign in to start generating capstone ideas!";
    }

    if (hasNoPlan) {
      return "Activate your free plan to get 10 idea generations!";
    }

    if (currentPlan?.type === 'unlimited') {
      return "Start your capstone with Levi's IdeaStone.";
    }

    const remaining = getRemainingGenerations();
    if (currentPlan?.type === 'free') {
      return `Start your capstone with Levi's IdeaStone.`;
    }

    return `Start your capstone with Levi's IdeaStone.`;
  };

  const getMainButtonState = () => {
    if (!isAuthenticated) {
      return {
        text: 'Try Demo Mode',
        disabled: false,
        icon: 'bi bi-symmetry-vertical',
        variant: 'demo'
      };
    }

    if (!canGenerateNow) {
      return {
        text: 'No Generations Left',
        disabled: true,
        icon: 'bi-lock',
        variant: 'disabled'
      };
    }

    return {
      text: 'Get Started',
      disabled: false,
      icon: 'bi bi-play',
      variant: 'primary'
    };
  };

  const mainButtonState = getMainButtonState();

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
            <nav className={`homepage-nav ${isAtUniversitySection ? 'nav-hidden' : ''}`}>
              <div className="nav-left">IdeaStone <i className="bi bi-strava"></i></div>



              <div className="subscription-status">
                {!isAuthenticated ? (
                  <span className="guest-badge">
                    <i className="bi bi-person"></i>
                    &nbsp;Guest Mode
                  </span>
                ) : hasNoPlan ? (
                  <span className="no-plan-badge">
                    No Plan Activated
                  </span>
                ) : isSubscribed ? (
                  <span className={`premium-badge ${currentPlan?.type}`}>
                    <i className="bi bi-star-fill"></i>
                    {getPlanDisplayName()}
                    {currentPlan?.type !== 'unlimited' && currentPlan?.type !== 'free' && (
                      <span className="plan-count">
                        {getRemainingGenerations()}
                      </span>
                    )}
                    {currentPlan?.type === 'free' && (
                      <span className="plan-count">
                        {getRemainingGenerations()}
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="free-badge">
                    <i className="bi bi-arrow-repeat"></i>
                    {getRemainingGenerations()} gens left
                  </span>
                )}
              </div>

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
                {/* Auth Welcome Message */}
                {isAuthenticated && (
                  <motion.div
                    className="user-welcome-message"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Welcome, {user.name}!
                  </motion.div>
                )}

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
                  {getSubtitleText()}
                </p>

              </header>

              <div className="homepage-button-group">
                <button
                  onClick={handleGetStarted}
                  className={`homepage-button ${mainButtonState.variant}`}
                  disabled={mainButtonState.disabled}
                >
                  <i className={`bi ${mainButtonState.icon}`}></i>
                  &nbsp; {mainButtonState.text}
                </button>
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      setIsLoginOpen(true);
                    } else {
                      handleSubscribe();
                    }
                  }}
                  className={`homepage-button ${!isAuthenticated ? 'auth-required' :
                    hasNoPlan ? 'free' :
                      isSubscribed ? 'manage' : 'upgrade'
                    }`}
                  disabled={false}
                >
                  {!isAuthenticated ? (
                    <>
                      <i className="bi bi-person-add"></i>
                      &nbsp; Sign In
                    </>
                  ) : hasNoPlan ? (
                    <>
                      <i className="bi bi-rocket-takeoff"></i>
                      &nbsp; View All Plans
                    </>
                  ) : isSubscribed ? (
                    <>
                      <i className="bi bi-gear"></i>
                      &nbsp; {getSubscribeButtonText()}
                    </>
                  ) : (
                    <>
                      <i className="bi bi-rocket-takeoff"></i>
                      &nbsp; {getSubscribeButtonText()}
                    </>
                  )}
                </button>
              </div>

              {/* Quick Plan Info */}
              {isAuthenticated && !hasNoPlan && isSubscribed && currentPlan && (
                <motion.div
                  className="current-plan-info"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="plan-details">
                    <span className="plan-name">{currentPlan.name}</span>
                    <span className="plan-feature-count">
                      {currentPlan.features.length} features included
                    </span>
                  </div>
                </motion.div>
              )}


            </div>
          </div>
        </div>
      </motion.div>

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
                <i className="bi bi-gitlab"></i>
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
                      src="src/assets/schools-logo/tmc_logo.png"
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
      <Login
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(userData) => {
          console.log('✅ Login successful in HomePage, user:', userData);

       
          auth.onLoginSuccess(userData);

      
          setIsLoginOpen(false);
        }}
      />

      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
        user={user}
      />

      <Admin />

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
                      <img src="src/assets/schools-logo/tmc_logo.png" alt="Trinidad Municipal College" className="logo-loop-image" />
                      <span>TMC</span>
                    </div>
                  </div>
                  <div className="logo-item">
                    <div className="logo-wrapper">
                      <img src="src/assets/schools-logo/bisu-logo2.png" alt="Bohol Island State University" className="logo-loop-image" />
                      <span>BISU</span>
                    </div>
                  </div>
                  <div className="logo-item">
                    <div className="logo-wrapper">
                      <img src="src/assets/schools-logo/TCC.png" alt="Tagbilaran City College" className="logo-loop-image" />
                      <span>TCC</span>
                    </div>
                  </div>
                  <div className="logo-item">
                    <div className="logo-wrapper">
                      <img src="src/assets/schools-logo/UCC.png" alt="Ubay City College" className="logo-loop-image" />
                      <span>UCC</span>
                    </div>
                  </div>
                  <div className="logo-item">
                    <div className="logo-wrapper">
                      <img src="src/assets/schools-logo/BIT.png" alt="BIT International College" className="logo-loop-image" />
                      <span>BIT</span>
                    </div>
                  </div>
                  <div className="logo-item">
                    <div className="logo-wrapper">
                      <img src="src/assets/schools-logo/BNSC.jpg" alt="Bohol Northern Star College" className="logo-loop-image" />
                      <span>BNSC</span>
                    </div>
                  </div>
                  <div className="logo-item">
                    <div className="logo-wrapper">
                      <img src="src/assets/schools-logo/tmc_logo.png" alt="Trinidad Municipal College" className="logo-loop-image" />
                      <span>TMC</span>
                    </div>
                  </div>
                  <div className="logo-item">
                    <div className="logo-wrapper">
                      <img src="src/assets/schools-logo/bisu-logo2.png" alt="Bohol Island State University" className="logo-loop-image" />
                      <span>BISU</span>
                    </div>
                  </div>
                  <div className="logo-item">
                    <div className="logo-wrapper">
                      <img src="src/assets/schools-logo/TCC.png" alt="Tagbilaran City College" className="logo-loop-image" />
                      <span>TCC</span>
                    </div>
                  </div>
                  <div className="logo-item">
                    <div className="logo-wrapper">
                      <img src="src/assets/schools-logo/UCC.png" alt="Ubay City College" className="logo-loop-image" />
                      <span>UCC</span>
                    </div>
                  </div>
                  <div className="logo-item">
                    <div className="logo-wrapper">
                      <img src="src/assets/schools-logo/BIT.png" alt="BIT International College" className="logo-loop-image" />
                      <span>BIT</span>
                    </div>
                  </div>
                  <div className="logo-item">
                    <div className="logo-wrapper">
                      <img src="src/assets/schools-logo/BNSC.jpg" alt="Bohol Northern Star College" className="logo-loop-image" />
                      <span>BNSC</span>
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

      {process.env.NODE_ENV === 'development' && (
        <motion.button
          onClick={() => {
            localStorage.removeItem('ideastone_subscription_v3');
            localStorage.removeItem('ideastone_generation_count_v3');
            localStorage.removeItem('ideastone_subscription_v2');
            localStorage.removeItem('ideastone_generation_count_v2');
            localStorage.removeItem('ideastone_user_data_v3');
            window.location.reload();
          }}
          className={`reset-subs-btn ${isScrolled ? 'hidden' : ''}`}
          initial={{ opacity: 1, y: 0 }}
          animate={{
            opacity: isScrolled ? 0 : 1,
            y: isScrolled ? 20 : 0
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          Reset All Data
        </motion.button>
      )}
    </div>
  );
};

export default HomePage;
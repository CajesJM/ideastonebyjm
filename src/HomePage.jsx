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
import Loader from './Components/Loader.jsx'
import './Style/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const headingRef = useRef(null);
  const [headingVisible, setHeadingVisible] = useState(false);
  const [loading, setLoading] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);

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
      canGenerate: canGenerateNow
    });
  }, [hasNoPlan, isSubscribed, currentPlan, isFreePlan, generationCount, getRemainingGenerations, canGenerateNow]);

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

  const handleSubscribe = () => {
    setIsSubscriptionOpen(true);
  };

  // NEW: Function to activate free plan
  const handleActivateFreePlan = () => {
    subscribe(SUBSCRIPTION_PLANS.FREE);
  };

  const handleGetStarted = () => {
    // If user has no plan, prompt them to activate free plan
    if (hasNoPlan) {
      setIsSubscriptionOpen(true);
      return;
    }

    // Check if user can generate ideas
    if (!canGenerateNow) {
      setIsSubscriptionOpen(true);
      return;
    }

    setLoading(true);
    setTimeout(() => navigate('./Generator'), 800);
  };

  // Get plan display name for badge
  const getPlanDisplayName = () => {
    if (hasNoPlan) return 'No Plan';
    if (currentPlan?.type === 'free') return 'Free';
    if (currentPlan?.type === 'starter') return 'Starter';
    if (currentPlan?.type === 'pro') return 'Pro';
    if (currentPlan?.type === 'unlimited') return 'Unlimited';
    return 'Premium';
  };

  // Get button text based on subscription state
  const getSubscribeButtonText = () => {
    if (hasNoPlan) return 'Get Free Plan';
    if (!isSubscribed) return 'Upgrade Now';
    if (currentPlan?.type === 'unlimited') return 'Manage Plan';
    return 'Upgrade Plan';
  };

  // Get subtitle text based on subscription state
  const getSubtitleText = () => {
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

  // Get main button text and state
  const getMainButtonState = () => {


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
      icon: 'bi-lightning',
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
            <nav className="homepage-nav">
              <div className="nav-left">IdeaStone <i className="bi bi-strava"></i></div>


              <div className="subscription-status">
                {hasNoPlan ? (
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
                  onClick={hasNoPlan ? handleActivateFreePlan : handleGetStarted}
                  className={`homepage-button ${mainButtonState.variant}`}
                  disabled={mainButtonState.disabled}
                >
                  <i className={`bi ${mainButtonState.icon}`}></i>
                  &nbsp; {mainButtonState.text}
                </button>

                <button
                  onClick={handleSubscribe}
                  className={`homepage-button ${hasNoPlan ? 'free' : isSubscribed ? 'manage' : 'upgrade'}`}>
                  {hasNoPlan ? (
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
              {!hasNoPlan && isSubscribed && currentPlan && (
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

              {/* Free Plan Activation Info */}
              {hasNoPlan && (
                <motion.div
                  className="free-plan-activation-info"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >

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

      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
      />

      <Admin />

      {/* Rest of your existing sections remain the same */}
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

      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={() => {
            localStorage.removeItem('ideastone_subscription_v3');
            localStorage.removeItem('ideastone_generation_count_v3');
            localStorage.removeItem('ideastone_subscription_v2');
            localStorage.removeItem('ideastone_generation_count_v2');
            window.location.reload();
          }}
          className="reset-subs-btn"
        >
          Reset All Subs
        </button>
      )}
    </div>
  );
};

export default HomePage;
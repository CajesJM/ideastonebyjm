import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Style/AboutPage.css';
import JM from '../src/assets/IMG_20240106_195144_425.jpg';

const AboutPage = () => {
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;

      setScrollProgress(progress);
      setShowScrollTop(scrollTop > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const teamMembers = [
    {
      name: "JM",
      role: "Full-Stack Developer",
      bio: "Passionate about creating intelligent systems that help students discover the perfect capstone projects from our curated database.",
      skills: ["React", "Node.js", "Firebase", "System Design", "React-Native", "SQL"],
      avatar: JM
    },
  ];

  const stats = [
    { number: "500+", label: "Curated Capstone Titles" },
    { number: "1K+", label: "Enhanced Projects" },
    { number: "10+", label: "University Partners" },
    { number: "4.8", label: "Student Rating" }
  ];

  const features = [
    {
      icon: "📚",
      title: "Smart Database",
      description: "Access our curated collection of proven capstone titles across various disciplines and technologies"
    },
    {
      icon: "⚡",
      title: "Instant Generation",
      description: "Get relevant capstone ideas instantly from our organized database with smart filtering"
    },
    {
      icon: "🔧",
      title: "Built-in Enhancement",
      description: "Our system intelligently enhances and personalizes titles based on your specific requirements"
    },
    {
      icon: "🔄",
      title: "Continuous Updates",
      description: "Regularly updated database with new successful capstone projects and emerging technologies"
    }
  ];

  return (
    <div className="about-page">
      <div className="about-background">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="about-container"
      >
        <section className="about-hero">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-content"
          >
            <div className="hero-badge">
              <i className="bi bi-database"></i>
              Smart Capstone Database
            </div>
            <h1 className="about-title">
              About <span className="gradient-text">IdeaStone</span>
            </h1>
            <p className="about-subtitle">
              Your intelligent database for discovering and enhancing exceptional capstone project titles
            </p>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="stat-value">500+</span>
                <span className="stat-desc">Curated Titles</span>
              </div>
              <div className="hero-stat">
                <span className="stat-value">95%</span>
                <span className="stat-desc">Relevance Rate</span>
              </div>
            </div>
            <motion.button
              onClick={() => navigate('/')}
              className="back-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="bi bi-arrow-left"></i>
              Back to Generator
            </motion.button>
          </motion.div>
        </section>

        <section className="problem-section">
          <div className="problem-grid">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="problem-card"
            >
              <div className="problem-header">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <h3>The Challenge</h3>
              </div>
              <p>
                Students struggle to find the right capstone title that balances innovation,
                feasibility, and academic requirements. Traditional methods rely on limited
                personal knowledge and repetitive brainstorming.
              </p>
              <ul className="problem-list">
                <li><i className="bi bi-arrow-bar-right"></i> Limited access to proven project ideas</li>
                <li><i className="bi bi-arrow-bar-right"></i> Difficulty assessing project viability</li>
                <li><i className="bi bi-arrow-bar-right"></i> Time-consuming research process</li>
                <li><i className="bi bi-arrow-bar-right"></i> Lack of personalized suggestions</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="solution-card"
            >
              <div className="solution-header">
                <i className="bi bi-lightning"></i>
                <h3>Our Solution</h3>
              </div>
              <p>
                IdeaStone provides instant access to a curated database of successful capstone titles
                with built-in enhancement algorithms that personalize suggestions based on your
                skills and requirements.
              </p>
              <ul className="solution-list">
                <li><i className="bi bi-arrow-bar-right"></i> Database of 500+ proven titles</li>
                <li><i className="bi bi-arrow-bar-right"></i> Smart enhancement algorithms</li>
                <li><i className="bi bi-arrow-bar-right"></i> Instant personalized suggestions</li>
                <li><i className="bi bi-arrow-bar-right"></i> Academic requirement matching</li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="features-section">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2>How IdeaStone Works</h2>
            <p>Smart database technology for capstone discovery</p>
          </motion.div>

          <div className="process-steps">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="process-step"
            >
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Query Our Database</h3>
                <p>Enter your field of study, interests, or keywords to search our curated collection of capstone titles</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="process-step"
            >
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Smart Matching</h3>
                <p>Our system matches your input with relevant titles from our database and applies enhancement algorithms</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="process-step"
            >
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Enhanced Results</h3>
                <p>Receive personalized, enhanced capstone titles tailored to your specific requirements and academic level</p>
              </div>
            </motion.div>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="feature-card"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="stat-card"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="stat-number">{stat.number}</h3>
                <p className="stat-label">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Database Info Section */}
        <section className="database-section">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="database-card"
          >
            <div className="database-icon">
              <i className="bi bi-server"></i>
            </div>
            <h2>Our Smart Database</h2>
            <p>
              IdeaStone maintains a comprehensive database of successful capstone projects across various
              disciplines including Computer Science, Engineering, Business, and more. Each title is
              carefully curated and enhanced with our built-in algorithms to ensure relevance, feasibility,
              and academic appropriateness.
            </p>
            <div className="database-stats">
              <div className="db-stat">
                <span className="db-number">15+</span>
                <span className="db-label">Fields of Study</span>
              </div>
              <div className="db-stat">
                <span className="db-number">50+</span>
                <span className="db-label">Technologies</span>
              </div>
              <div className="db-stat">
                <span className="db-number">Monthly</span>
                <span className="db-label">Updates</span>
              </div>
            </div>
          </motion.div>
        </section>
        {/* Team Section */}
        <section className="team-section">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2>The Team Behind IdeaStone</h2>
            <p>Dedicated to building the most comprehensive capstone database for students</p>
          </motion.div>

          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                className="team-card"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="member-avatar">
                  <img
                    src={member.avatar}
                    alt={`${member.name} - ${member.role}`}
                    className="avatar-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'avatar-fallback';
                      fallback.textContent = member.name.charAt(0);
                      e.target.parentNode.appendChild(fallback);
                    }}
                  />
                </div>
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-bio">{member.bio}</p>
                <div className="skills-list">
                  {member.skills.map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mission-card"
          >
            <div className="mission-icon">
              <i className="bi bi-database"></i>
            </div>
            <h2>Our Mission</h2>
            <p>
              To provide every student with instant access to high-quality, relevant capstone project ideas
              through our smart database system. We believe that finding the right project should be
              effortless, allowing students to focus on what matters most - building exceptional projects
              that demonstrate their skills and knowledge.
            </p>
          </motion.div>
        </section>
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              className="scroll-top-btn"
              onClick={scrollToTop}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <i className="bi bi-chevron-up"></i>
            </motion.button>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};

export default AboutPage;
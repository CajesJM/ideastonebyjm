import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Style/Support.css';

const Support = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('brainstorming');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project: '',
    helpType: 'brainstorming',
    description: '',
    timeline: '',
    urgency: 'standard'
  });
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
  const consultationTypes = [
    {
      id: 'brainstorming',
      title: 'Idea Brainstorming & Validation',
      description: 'Transform your initial concepts into well-defined, feasible capstone projects with expert guidance.',
      features: ['Idea Generation', 'Market Research', 'Feasibility Analysis', 'Scope Definition'],
      bestFor: 'Students starting their capstone journey'
    },
    {
      id: 'technical',
      title: 'Technical Architecture & Stack',
      description: 'Get expert advice on technology selection, system design, and implementation strategies.',
      features: ['Tech Stack Selection', 'System Architecture', 'Database Design', 'API Planning'],
      bestFor: 'Students planning technical implementation'
    },
    {
      id: 'development',
      title: 'Development Guidance & Code Review',
      description: 'Personalized coding assistance, best practices, and comprehensive code reviews.',
      features: ['Code Review', 'Debugging Sessions', 'Best Practices', 'Performance Optimization'],
      bestFor: 'Students actively developing their projects'
    },
    {
      id: 'planning',
      title: 'Project Management & Timeline',
      description: 'Strategic planning for milestones, deliverables, and successful project completion.',
      features: ['Milestone Planning', 'Timeline Setup', 'Resource Allocation', 'Risk Assessment'],
      bestFor: 'Students needing project management help'
    },
    {
      id: 'review',
      title: 'Code & Design Review',
      description: 'Comprehensive analysis of your codebase and design patterns with actionable improvement suggestions.',
      features: ['Code Quality Assessment', 'Design Pattern Review', 'Performance Analysis', 'Best Practices Implementation'],
      bestFor: 'Students wanting to improve code quality and architecture'
    },
    {
      id: 'debugging',
      title: 'Debugging Help & Problem Solving',
      description: 'Expert assistance in identifying and resolving complex technical issues and bugs.',
      features: ['Bug Diagnosis', 'Error Resolution', 'Performance Issues', 'Integration Problems'],
      bestFor: 'Students stuck on specific technical challenges'
    },
    {
      id: 'deployment',
      title: 'Deployment Support & DevOps',
      description: 'Guidance through the deployment process, from local development to production environment.',
      features: ['Environment Setup', 'CI/CD Pipeline', 'Cloud Deployment', 'Performance Optimization'],
      bestFor: 'Students ready to deploy their projects'
    },
    {
      id: 'documentation',
      title: 'Documentation & Presentation Help',
      description: 'Professional assistance with project documentation, thesis writing, and presentation preparation.',
      features: ['Technical Documentation', 'Thesis Structure', 'Presentation Design', 'Demo Preparation'],
      bestFor: 'Students preparing project deliverables and presentations'
    }
  ];

  const supportTiers = [
    {
      name: 'Standard Support',
      price: 'Free',
      description: 'Perfect for getting started and basic guidance',
      features: [
        'Email support within 24 hours',
        'Basic project review',
        'Idea validation',
        'Resource recommendations'
      ],
      recommended: false
    },
    {
      name: 'Premium Guidance',
      price: 'Project-Based',
      description: 'Comprehensive support for your entire capstone journey',
      features: [
        'Weekly 1:1 sessions',
        'Unlimited code reviews',
        'Architecture design help',
        'Deployment assistance',
        'Presentation preparation',
        'Priority email support'
      ],
      recommended: true
    },
    {
      name: 'Emergency Technical',
      price: 'Urgent',
      description: 'Immediate help for critical project issues',
      features: [
        '2-hour response time',
        'Live debugging sessions',
        'Emergency architecture review',
        'Deployment crisis support',
        '24/7 availability'
      ],
      recommended: false
    }
  ];

  const faqs = [
    {
      question: "How quickly will I receive help after submitting my request?",
      answer: "Standard requests receive initial responses within 24 hours. Premium and emergency support have faster response times of 4 hours and 2 hours respectively."
    },
    {
      question: "What technologies and project types do you support?",
      answer: "We support all major technologies including React, Node.js, Python, Java, mobile development, AI/ML, data science, IoT, and more. Any capstone-appropriate project type is welcome."
    },
    {
      question: "Do you write code for students or just provide guidance?",
      answer: "We provide guidance, code reviews, and mentorship. We help you understand concepts and solve problems while ensuring you write the code yourself for optimal learning outcomes."
    },
    {
      question: "Can I get help with project documentation and presentation?",
      answer: "Absolutely! We provide comprehensive support including project proposals, technical documentation, thesis writing, and presentation preparation with proven templates."
    },
    {
      question: "What if I need ongoing support throughout my project?",
      answer: "Our premium tier offers weekly check-ins and continuous support from project inception through completion and presentation."
    },
    {
      question: "Is there support for team projects?",
      answer: "Yes! We provide specialized guidance for team dynamics, collaboration tools, version control strategies, and coordinating multiple contributors."
    }
  ];

  const successStories = [
    {
      name: "Levi",
      project: "EcoTrack Environmental Platform ",
      university: "Trinidad Municipal College",
      quote: "The technical architecture session completely transformed my approach. What started as a simple web app became a scalable platform that impressed both my professors and potential employers.",
      outcome: "A+ Grade & Job Offer",
      duration: "4 months",
      helpUsed: ["Technical Architecture", "Weekly Code Reviews"]
    },
    {
      name: "Arisu",
      project: "MedAssist AI Diagnostic Tool ",
      university: "Trinidad Municipal College",
      quote: "I was stuck on my machine learning model for weeks. The debugging session identified the issue in minutes, and the ongoing guidance helped me implement proper validation metrics.",
      outcome: "Research Publication",
      duration: "6 months",
      helpUsed: ["AI/ML Guidance", "Debugging Support"]
    },
    {
      name: "Kian",
      project: "SmartInventory Business Suite ",
      university: "Trinidad Municipal College",
      quote: "The project planning assistance helped me break down a complex system into manageable milestones. The weekly reviews kept me on track and the final result exceeded expectations.",
      outcome: "Business Department Award",
      duration: "5 months",
      helpUsed: ["Project Planning", "Database Design"]
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      alert('Thank you for your request! We will contact you within 24 hours to schedule your consultation.');
      setFormData({
        name: '',
        email: '',
        project: '',
        helpType: 'brainstorming',
        description: '',
        timeline: '',
        urgency: 'standard'
      });
    }, 2000);
  };

  const handleUrgentHelp = () => {
    setFormData(prev => ({
      ...prev,
      urgency: 'emergency',
      helpType: 'debugging'
    }));
    document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="support-page">
      {/* Background Elements */}
      <div className="support-background">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        <div className="floating-orb orb-4"></div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="support-container"
      >
        {/* Header Section */}
        <section className="support-hero">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-content"
          >
            <div className="hero-badge">
              <i className="bi bi-patch-check"></i>
              <span>Trinidad Municipal College Supported</span>
            </div>
            <h1 className="support-title">
              Idea<span className="gradient-text">Stone Support</span>
            </h1>
            <p className="support-subtitle">
              Get personalized guidance from experienced developers and educators.
              Transform your capstone idea into an impressive, market-ready project.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">2+</span>
                <span className="stat-label">Projects Helped</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.9/5</span>
                <span className="stat-label">Satisfaction Rate</span>
              </div>
              <div className="stat">
                <span className="stat-number">24h</span>
                <span className="stat-label">Avg Response</span>
              </div>
            </div>
            <motion.button
              onClick={() => navigate('/')}
              className="back-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="bi bi-arrow-left"></i>
              Back to Home
            </motion.button>
          </motion.div>
        </section>

        {/* Support Tiers */}
        <section className="tiers-section">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2>Choose Your Support Level</h2>
            <p>Select the level of guidance that matches your project needs</p>
          </motion.div>

          <div className="tiers-grid">
            {supportTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                className={`tier-card ${tier.recommended ? 'recommended' : ''}`}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                {tier.recommended && (
                  <div className="recommended-badge">
                    <i className="bi bi-star-fill"></i>
                    Most Popular
                  </div>
                )}
                <div className="tier-header">
                  <h3>{tier.name}</h3>
                  <div className="tier-price">{tier.price}</div>
                  <p className="tier-description">{tier.description}</p>
                </div>
                <div className="tier-features">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="feature-item">
                      <i className="bi bi-check-circle-fill"></i>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <motion.button
                  className={`tier-button ${tier.recommended ? 'primary' : 'secondary'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    let urgencyLevel = 'standard';
                    if (tier.name === 'Premium Guidance') urgencyLevel = 'priority';
                    if (tier.name === 'Emergency Technical') urgencyLevel = 'emergency';

                    setFormData(prev => ({
                      ...prev,
                      urgency: urgencyLevel
                    }));
                    document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {tier.price === 'Free' ? 'Get Started' : 'Request'}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="consultation-section">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2>Specialized Support Areas</h2>
            <p>Targeted help for every stage of your capstone journey</p>
          </motion.div>

          <div className="consultation-grid">
            {consultationTypes.map((type, index) => (
              <motion.div
                key={type.id}
                className={`consultation-card ${activeTab === type.id ? 'active' : ''}`}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                onClick={() => setActiveTab(type.id)}
              >
                <div className="card-header">
                </div>
                <h3>{type.title}</h3>
                <p className="consultation-desc">{type.description}</p>
                <div className="best-for">
                  <i className="bi bi-person-check"></i>
                  Best for: {type.bestFor}
                </div>
                <div className="features-list">
                  {type.features.map((feature, idx) => (
                    <span key={idx} className="feature-tag">
                      <i className="bi bi-check"></i>
                      {feature}
                    </span>
                  ))}
                </div>
                <motion.button
                  className="select-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, helpType: type.id }));
                    document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Select This Service
                </motion.button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="contact-form-section" id="contact-form">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="form-container"
          >
            <div className="form-header">
              <h2>Request Capstone Support</h2>
              <p>Tell us about your project and we'll match you with the perfect help</p>
            </div>

            <form onSubmit={handleSubmit} className="support-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your.email@ideastone.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="project">Project Type *</label>
                  <select
                    id="project"
                    name="project"
                    value={formData.project}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select project category</option>
                    <option value="web">Web Application</option>
                    <option value="mobile">Mobile Application</option>
                    <option value="ai-ml">AI/ML Project</option>
                    <option value="data-science">Data Science</option>
                    <option value="iot">IoT System</option>
                    <option value="desktop">Desktop Application</option>
                    <option value="game">Game Development</option>
                    <option value="research">Research Tool</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="helpType">Primary Help Needed *</label>
                  <select
                    id="helpType"
                    name="helpType"
                    value={formData.helpType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="brainstorming">Idea Brainstorming</option>
                    <option value="technical">Technical Architecture</option>
                    <option value="development">Development Guidance</option>
                    <option value="planning">Project Planning</option>
                    <option value="review">Code & Design Review</option>
                    <option value="debugging">Debugging Help</option>
                    <option value="deployment">Deployment Support</option>
                    <option value="documentation">Documentation Help</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="urgency">Support Urgency</label>
                  <div className="urgency-options">
                    <label className="urgency-option">
                      <input
                        type="radio"
                        name="urgency"
                        value="standard"
                        checked={formData.urgency === 'standard'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      Standard (24-48 hours)
                    </label>
                    <label className="urgency-option">
                      <input
                        type="radio"
                        name="urgency"
                        value="priority"
                        checked={formData.urgency === 'priority'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      Priority (4-12 hours)
                    </label>
                    <label className="urgency-option emergency">
                      <input
                        type="radio"
                        name="urgency"
                        value="emergency"
                        checked={formData.urgency === 'emergency'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      Emergency (2 hours)
                    </label>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="description">Project Details & Help Needed *</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Please describe your project, current progress, technologies used, and specific areas where you need assistance. The more details you provide, the better we can help!"
                    rows="5"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="timeline">Project Timeline</label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                  >
                    <option value="">Select your timeline</option>
                    <option value="planning">Just Starting (Planning Phase)</option>
                    <option value="early">Early Development (1-3 months left)</option>
                    <option value="mid">Mid Development (1 month left)</option>
                    <option value="final">Final Stages (2 weeks left)</option>
                    <option value="urgent">Urgent Deadline (1 week or less)</option>
                  </select>
                </div>
              </div>

              <div className="form-footer">
                <p className="privacy-note">
                  <i className="bi bi-shield-check"></i>
                  Your information is secure. We respect your privacy and never share your data with third parties.
                </p>
                <motion.button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Processing Your Request...
                    </>
                  ) : (
                    <>
                      Submit Support Request
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </section>

        {/* Success Stories */}
        <section className="stories-section">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2>Student Success Stories</h2>
            <p>See how our guidance has helped students achieve exceptional results</p>
          </motion.div>

          <div className="stories-grid">
            {successStories.map((story, index) => (
              <motion.div
                key={index}
                className="story-card"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="quote-mark">"</div>
                <p className="story-quote">{story.quote}</p>
                <div className="story-author">
                  <div className="author-info">
                    <strong>{story.name}</strong>
                    <span>{story.project}</span>
                    <small>{story.university}</small>
                  </div>
                </div>
                <div className="story-meta">
                  <div className="story-outcome">
                    <i className="bi bi-trophy"></i>
                    {story.outcome}
                  </div>
                  <div className="story-duration">
                    <i className="bi bi-clock-history"></i>
                    {story.duration}
                  </div>
                </div>
                <div className="help-used">
                  {story.helpUsed.map((help, idx) => (
                    <span key={idx} className="help-tag">{help}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about our capstone support services</p>
          </motion.div>

          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="faq-card"
                initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="faq-icon">
                  <i className="bi bi-question-circle"></i>
                </div>
                <div className="faq-content">
                  <h4>{faq.question}</h4>
                  <p>{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Emergency Help Section */}
        <section className="emergency-section">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="emergency-card"
          >
            <div className="emergency-content">
              <div className="emergency-badge">
                <i className="bi bi-lightning-charge"></i>
                Emergency Support
              </div>
              <h2>Critical Project Deadline?</h2>
              <p>Get immediate assistance for urgent technical issues, deployment problems, or last-minute project crises.</p>
              <div className="emergency-features">
                <div className="emergency-feature">
                  <i className="bi bi-alarm"></i>
                  <div>
                    <strong>2-Hour Response</strong>
                    <span>Guaranteed quick response</span>
                  </div>
                </div>
                <div className="emergency-feature">
                  <i className="bi bi-code-square"></i>
                  <div>
                    <strong>Live Debugging</strong>
                    <span>Real-time problem solving</span>
                  </div>
                </div>
                <div className="emergency-feature">
                  <i className="bi bi-shield-check"></i>
                  <div>
                    <strong>Priority Access</strong>
                    <span>Jump to front of the queue</span>
                  </div>
                </div>
              </div>
            </div>
            <motion.button
              className="emergency-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUrgentHelp}
            >
              <i className="bi bi-telephone-fill"></i>
              Request Emergency Help Now
            </motion.button>
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

export default Support;
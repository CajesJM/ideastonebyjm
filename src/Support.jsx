import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Style/Support.css';

const Support = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('consultation');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const consultationTypes = [
    {
      id: 'brainstorming',
      title: 'Idea Brainstorming',
      description: 'Get help generating and refining your capstone project ideas',
      duration: '30-60 mins',
      icon: '💡',
      features: ['Idea Generation', 'Project Scope', 'Feasibility Analysis']
    },
    {
      id: 'technical',
      title: 'Technical Guidance',
      description: 'Technical support for your chosen stack and implementation',
      duration: '45-90 mins',
      icon: '⚙️',
      features: ['Code Review', 'Architecture Planning', 'Debugging Help']
    },
    {
      id: 'planning',
      title: 'Project Planning',
      description: 'Help with project timeline, milestones, and deliverables',
      duration: '30-45 mins',
      icon: '📋',
      features: ['Timeline Setup', 'Milestone Planning', 'Resource Allocation']
    },
    {
      id: 'review',
      title: 'Project Review',
      description: 'Comprehensive review of your current project progress',
      duration: '60 mins',
      icon: '🔍',
      features: ['Code Review', 'Architecture Feedback', 'Improvement Tips']
    }
  ];

  const faqs = [
    {
      question: "How quickly can I get help with my capstone project?",
      answer: "Typically within 24 hours for initial responses. Emergency support is available for urgent technical issues."
    },
    {
      question: "What kind of projects can you help with?",
      answer: "Web applications, mobile apps, AI/ML projects, data science, IoT, game development, and more. We cover most technologies used in capstone projects."
    },
    {
      question: "Do you write code for students?",
      answer: "No, we provide guidance, review, and mentorship. We help you understand concepts and solve problems, but you write the code yourself to ensure learning."
    },
    {
      question: "Can I get help with project documentation?",
      answer: "Yes! We provide templates and guidance for project proposals, documentation, presentations, and thesis writing."
    },
    {
      question: "What if I need ongoing support throughout my project?",
      answer: "We offer weekly check-ins and ongoing mentorship packages to support you from idea to completion."
    }
  ];

  const successStories = [
    {
      name: "Sarah Chen",
      project: "HealthTech Mobile App",
      quote: "IdeaStone helped me turn a simple concept into a fully-functional React Native app that got me an A+!",
      outcome: "Completed in 3 months"
    },
    {
      name: "Marcus Rodriguez",
      project: "AI Research Tool",
      quote: "The technical guidance saved me weeks of debugging. My professor was impressed with the architecture.",
      outcome: "Published as research paper"
    },
    {
      name: "Jessica Williams",
      project: "E-commerce Platform",
      quote: "From database design to deployment, the support was incredible. Landed a job because of this project!",
      outcome: "Job offer received"
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Thank you! We will contact you within 24 hours to schedule your consultation.');
    }, 2000);
  };

  return (
    <div className="support-page">
      {/* Background Elements */}
      <div className="support-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
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
            <h1 className="support-title">
              Get <span className="gradient-text">Project Help</span>
            </h1>
            <p className="support-subtitle">
              Personalized support for your capstone project journey
            </p>
            <motion.button
              onClick={() => navigate(-1)}
              className="back-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="bi bi-arrow-left"></i>
              Back to Home
            </motion.button>
          </motion.div>
        </section>

        {/* Consultation Types */}
        <section className="consultation-section">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2>Choose Your Support Type</h2>
            <p>Get the exact help you need for your capstone project</p>
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
                <div className="consultation-icon">
                  {type.icon}
                </div>
                <h3>{type.title}</h3>
                <p className="consultation-desc">{type.description}</p>
                <div className="duration-badge">
                  <i className="bi bi-clock"></i>
                  {type.duration}
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
                >
                  Select This Help
                </motion.button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="contact-form-section">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="form-container"
          >
            <div className="form-header">
              <h2>Schedule Your Consultation</h2>
              <p>Tell us about your project and we'll match you with the right help</p>
            </div>

            <form onSubmit={handleSubmit} className="support-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="project">Project Type</label>
                  <select id="project" name="project" required>
                    <option value="">Select project type</option>
                    <option value="web">Web Application</option>
                    <option value="mobile">Mobile App</option>
                    <option value="ai">AI/ML Project</option>
                    <option value="data">Data Science</option>
                    <option value="iot">IoT Project</option>
                    <option value="game">Game Development</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="help-type">Help Needed</label>
                  <select id="help-type" name="helpType" required>
                    <option value="">Select help type</option>
                    <option value="brainstorming">Idea Brainstorming</option>
                    <option value="technical">Technical Guidance</option>
                    <option value="planning">Project Planning</option>
                    <option value="review">Code Review</option>
                    <option value="debugging">Debugging Help</option>
                    <option value="deployment">Deployment Help</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="description">Project Description</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Briefly describe your project, current progress, and specific areas where you need help..."
                    rows="4"
                    required
                  ></textarea>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="timeline">Project Timeline</label>
                  <select id="timeline" name="timeline" required>
                    <option value="">Select your timeline</option>
                    <option value="urgent">Urgent (Within 1 week)</option>
                    <option value="soon">Soon (1-2 weeks)</option>
                    <option value="flexible">Flexible (1+ month)</option>
                    <option value="planning">Just Planning</option>
                  </select>
                </div>
              </div>

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
                    Sending Request...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send"></i>
                    Request Help Now
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
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
            <p>Quick answers to common questions about our support</p>
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
                <h4>{faq.question}</h4>
                <p>{faq.answer}</p>
              </motion.div>
            ))}
          </div>
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
            <h2>Success Stories</h2>
            <p>See how we've helped students achieve their capstone goals</p>
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
                  <strong>{story.name}</strong>
                  <span>{story.project}</span>
                </div>
                <div className="story-outcome">
                  <i className="bi bi-trophy"></i>
                  {story.outcome}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Quick Help Section */}
        <section className="quick-help-section">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="quick-help-card"
          >
            <div className="help-content">
              <h2>Need Immediate Help?</h2>
              <p>Emergency technical support for urgent project issues</p>
              <div className="help-features">
                <div className="help-feature">
                  <i className="bi bi-lightning"></i>
                  <span>Response within 2 hours</span>
                </div>
                <div className="help-feature">
                  <i className="bi bi-code-slash"></i>
                  <span>Live debugging session</span>
                </div>
                <div className="help-feature">
                  <i className="bi bi-shield-check"></i>
                  <span>Priority support</span>
                </div>
              </div>
            </div>
            <motion.button
              className="emergency-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="bi bi-telephone"></i>
              Request Emergency Help
            </motion.button>
          </motion.div>
        </section>
      </motion.div>
    </div>
  );
};

export default Support;
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Style/ProjectShowcase.css';

const ProjectShowcase = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const projects = [
    {
      id: 1,
      title: "EcoTrack - Environmental Analytics Platform",
      category: "Web Application",
      description: "A comprehensive environmental monitoring system that helps organizations track and reduce their carbon footprint through real-time analytics and AI-powered sustainability recommendations.",
      technologies: ["React", "Node.js", "MongoDB", "D3.js", "Python", "TensorFlow"],
      image: "🌱",
      status: "Completed",
      rating: 4.9,
      student: "Cristine Joy",
      university: "Trinidad Municipal College",
      duration: "4 months",
      difficulty: "Advanced",
      features: ["Real-time Carbon Analytics", "AI Sustainability Advisor", "Custom Reporting Dashboard", "API Integrations"],
      github: "https://github.com/sarahm/ecotrack",
      liveDemo: "https://ecotrack-demo.vercel.app",
      achievements: ["Best Capstone Project 2024", "Featured in University Tech Review"]
    },
    {
      id: 2,
      title: "MedAssist AI - Diagnostic Learning Platform",
      category: "AI/ML Project",
      description: "An intelligent platform that helps medical students practice diagnosis through simulated patient cases powered by machine learning algorithms.",
      technologies: ["Python", "TensorFlow", "FastAPI", "React", "PostgreSQL"],
      image: "🏥",
      status: "In Progress",
      rating: 4.8,
      student: "Azeel",
      university: "Trinidad Municipal College",
      duration: "6 months",
      difficulty: "Expert",
      features: ["AI Diagnosis Simulation", "Interactive Case Studies", "Progress Analytics", "Peer Review System"],
      github: "https://github.com/alexk/medassist",
      liveDemo: null,
      achievements: ["Selected for University AI Incubator"]
    },
    {
      id: 3,
      title: "CampusConnect - Student Collaboration Hub",
      category: "Mobile App",
      description: "A university social platform that connects students with similar academic interests and facilitates project collaboration across different departments.",
      technologies: ["React Native", "Firebase", "Node.js", "Redux", "Google Maps API"],
      image: "🎓",
      status: "Completed",
      rating: 4.7,
      student: "Chisiya",
      university: "Trinidad Municipal College",
      duration: "3 months",
      difficulty: "Intermediate",
      features: ["Interest-Based Matching", "Project Collaboration Tools", "Event Management", "Real-time Chat"],
      github: "https://github.com/jamesl/campusconnect",
      liveDemo: "https://campusconnect-app.com",
      achievements: ["500+ Active Users", "Featured in Campus Newsletter"]
    },
    {
      id: 4,
      title: "SmartInventory Pro - Business Intelligence Suite",
      category: "Desktop Application",
      description: "AI-powered inventory management system with predictive analytics designed specifically for small to medium-sized retail businesses.",
      technologies: ["Java", "Spring Boot", "MySQL", "Python", "ML.NET"],
      image: "📊",
      status: "Completed",
      rating: 5.0,
      student: "Levi",
      university: "Trinidad Municipal College",
      duration: "5 months",
      difficulty: "Advanced",
      features: ["Predictive Inventory Analytics", "Barcode Scanning", "Sales Forecasting", "Supplier Management"],
      github: "https://github.com/marias/smartinventory",
      liveDemo: null,
      achievements: ["Adopted by 3 Local Businesses", "Business Department Award"]
    },
    {
      id: 5,
      title: "VR Learning Lab - Immersive Education",
      category: "VR/AR Project",
      description: "Virtual reality platform that creates immersive STEM learning experiences through interactive 3D simulations and laboratory experiments.",
      technologies: ["Unity", "C#", "Oculus SDK", "Blender", "Three.js"],
      image: "👓",
      status: "In Progress",
      rating: 4.6,
      student: "Arisu.exe",
      university: "Trinidad Municipal College",
      duration: "8 months",
      difficulty: "Expert",
      features: ["3D Science Simulations", "Interactive Virtual Labs", "Student Progress Tracking", "Multi-user Collaboration"],
      github: "https://github.com/davidt/vrlearning",
      liveDemo: null,
      achievements: ["Grant from Education Innovation Fund"]
    },
    {
      id: 6,
      title: "FarmTech Analytics - Smart Agriculture System",
      category: "IoT Project",
      description: "Comprehensive IoT-based smart farming solution that monitors soil conditions, weather patterns, and crop health to optimize agricultural productivity.",
      technologies: ["Arduino", "Python", "React", "AWS IoT", "TensorFlow Lite"],
      image: "🚜",
      status: "Completed",
      rating: 4.9,
      student: "Joker",
      university: "Trinidad Municipal College",
      duration: "6 months",
      difficulty: "Advanced",
      features: ["Soil Sensor Network", "Weather Prediction", "Crop Health Monitoring", "Mobile Alerts"],
      github: "https://github.com/rachelg/farmtech",
      liveDemo: "https://farmtech-demo.netlify.app",
      achievements: ["Agriculture Innovation Award", "Featured in TechFarm Magazine"]
    },
    {
      id: 7,
      title: "CodeMentor AI - Programming Assistant",
      category: "AI/ML Project",
      description: "Intelligent programming assistant that provides real-time code suggestions, debugging help, and personalized learning paths for computer science students.",
      technologies: ["Python", "OpenAI API", "React", "MongoDB", "Docker"],
      image: "🤖",
      status: "Completed",
      rating: 4.8,
      student: "Daddy Paul",
      university: "Trinidad Municipal College",
      duration: "4 months",
      difficulty: "Advanced",
      features: ["AI Code Completion", "Debugging Assistant", "Personalized Learning", "Code Review"],
      github: "https://github.com/michaelc/codementor",
      liveDemo: "https://codementor-ai.herokuapp.com",
      achievements: ["Computer Science Department Award"]
    },
    {
      id: 8,
      title: "LocalMarket Hub - E-commerce Platform",
      category: "Web Application",
      description: "A specialized e-commerce platform connecting local artisans and small businesses with their community through an intuitive online marketplace.",
      technologies: ["Vue.js", "Laravel", "MySQL", "Stripe API", "Redis"],
      image: "🛍️",
      status: "Completed",
      rating: 4.7,
      student: "Kian",
      university: "Trinidad Municipal College",
      duration: "5 months",
      difficulty: "Intermediate",
      features: ["Vendor Management", "Payment Processing", "Inventory Tracking", "Customer Reviews"],
      github: "https://github.com/jessicaw/localmarket",
      liveDemo: "https://localmarkethub.com",
      achievements: ["Community Business Partnership", "100+ Registered Vendors"]
    }
  ];

  const categories = ["All", "Web Application", "Mobile App", "AI/ML Project", "Desktop Application", "VR/AR Project", "IoT Project"];
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced", "Expert"];

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const openProjectModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="showcase-page">
      {/* Background Elements */}
      <div className="showcase-background">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        <div className="floating-orb orb-4"></div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="showcase-container"
      >
        {/* Header Section */}
        <section className="showcase-hero">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-content"
          >
            <div className="hero-badge">
              <i className="bi bi-trophy-fill"></i>
              <span>Trinidad Municipal College</span>
            </div>
            <h1 className="showcase-title">
              Capstone Project <span className="gradient-text">Showcase</span>
            </h1>
            <p className="showcase-subtitle">
              Discover exceptional student projects built with IdeaStone. 
              See how our students transform innovative ideas into real-world solutions.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">{projects.length}+</span>
                <span className="stat-label">Projects</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.8</span>
                <span className="stat-label">Avg Rating</span>
              </div>
              <div className="stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Success Rate</span>
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

        {/* Search and Filter Section */}
        <section className="filter-section">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="filter-container"
          >
            <div className="search-box">
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="Search projects, technologies, or features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchTerm("")}
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>

            <div className="filter-controls">
              <div className="filter-group">
                <label>Category</label>
                <div className="filter-buttons">
                  {categories.map(category => (
                    <button
                      key={category}
                      className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Projects Grid */}
        <section className="projects-section">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategory}-${searchTerm}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="projects-grid-container"
            >
              {filteredProjects.length > 0 ? (
                <>
                  <div className="results-info">
                    <span className="results-count">
                      Showing {filteredProjects.length} of {projects.length} projects
                    </span>
                  </div>
                  <div className="projects-grid">
                    {filteredProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        className="project-card"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ y: -8, transition: { duration: 0.3 } }}
                        onClick={() => openProjectModal(project)}
                      >
                        <div className="project-header">
                          <div className="project-image">
                            {project.image}
                          </div>
                          <div className="project-badges">
                            <span className={`status-badge ${project.status.toLowerCase().replace(' ', '-')}`}>
                              {project.status}
                            </span>
                            <span className={`difficulty-badge ${project.difficulty.toLowerCase()}`}>
                              {project.difficulty}
                            </span>
                          </div>
                        </div>

                        <div className="project-content">
                          <div className="project-meta">
                            <span className="project-category">{project.category}</span>
                            <div className="project-rating">
                              <i className="bi bi-star-fill"></i>
                              {project.rating}
                            </div>
                          </div>
                          
                          <h3 className="project-title">{project.title}</h3>
                          <p className="project-description">{project.description}</p>
                          
                          <div className="project-features">
                            {project.features.slice(0, 3).map((feature, idx) => (
                              <span key={idx} className="feature-tag">
                                <i className="bi bi-check-circle"></i>
                                {feature}
                              </span>
                            ))}
                            {project.features.length > 3 && (
                              <span className="feature-tag more">
                                +{project.features.length - 3} more
                              </span>
                            )}
                          </div>

                          <div className="technologies-list">
                            {project.technologies.slice(0, 4).map(tech => (
                              <span key={tech} className="tech-tag">{tech}</span>
                            ))}
                            {project.technologies.length > 4 && (
                              <span className="tech-tag more">+{project.technologies.length - 4}</span>
                            )}
                          </div>

                          <div className="project-footer">
                            <div className="student-info">
                              <div className="student-avatar">
                                <i className="bi bi-person-circle"></i>
                              </div>
                              <div className="student-details">
                                <span className="student-name">{project.student}</span>
                                <span className="student-university">{project.university}</span>
                              </div>
                            </div>
                            <div className="project-actions">
                              <motion.button
                                className="view-project-btn"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openProjectModal(project);
                                }}
                              >
                                View Details
                                <i className="bi bi-arrow-up-right"></i>
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="no-results"
                >
                  <i className="bi bi-search"></i>
                  <h3>No projects found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                  <button 
                    className="clear-filters-btn"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All");
                    }}
                  >
                    Clear All Filters
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* CTA Section */}
        <section className="showcase-cta">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="cta-card"
          >
            <div className="cta-content">
              <h2>Ready to Build Your Legacy?</h2>
              <p>Join these exceptional students and create a capstone project that stands out. 
                 With IdeaStone, you'll have the tools and guidance to turn your vision into reality.</p>
              <div className="cta-buttons">
                <motion.button
                  onClick={() => navigate('/generator')}
                  className="cta-button primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Your Project
                </motion.button>
                <motion.button
                  onClick={() => navigate('/support')}
                  className="cta-button secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Personalized Help
                </motion.button>
              </div>
            </div>
            <div className="cta-stats">
              <div className="cta-stat">
                <span className="cta-stat-number">95%</span>
                <span className="cta-stat-label">Student Satisfaction</span>
              </div>
              <div className="cta-stat">
                <span className="cta-stat-number">5+</span>
                <span className="cta-stat-label">Projects Completed</span>
              </div>
              <div className="cta-stat">
                <span className="cta-stat-number">4.8/5</span>
                <span className="cta-stat-label">Average Rating</span>
              </div>
            </div>
          </motion.div>
        </section>
      </motion.div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={closeProjectModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="project-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={closeProjectModal}>
                <i className="bi bi-x"></i>
              </button>
              
              <div className="modal-content">
                <div className="modal-header">
                  <div className="modal-image">
                    {selectedProject.image}
                  </div>
                  <div className="modal-title-section">
                    <h2>{selectedProject.title}</h2>
                    <div className="modal-meta">
                      <span className="modal-category">{selectedProject.category}</span>
                      <span className={`modal-status ${selectedProject.status.toLowerCase().replace(' ', '-')}`}>
                        {selectedProject.status}
                      </span>
                      <div className="modal-rating">
                        <i className="bi bi-star-fill"></i>
                        {selectedProject.rating}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-body">
                  <div className="modal-grid">
                    <div className="modal-main">
                      <h3>Project Overview</h3>
                      <p>{selectedProject.description}</p>
                      
                      <h4>Key Features</h4>
                      <div className="modal-features">
                        {selectedProject.features.map((feature, idx) => (
                          <div key={idx} className="modal-feature">
                            <i className="bi bi-check-circle-fill"></i>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <h4>Technologies Used</h4>
                      <div className="modal-technologies">
                        {selectedProject.technologies.map(tech => (
                          <span key={tech} className="modal-tech-tag">{tech}</span>
                        ))}
                      </div>
                    </div>

                    <div className="modal-sidebar">
                      <div className="project-info-card">
                        <h4>Project Details</h4>
                        <div className="info-item">
                          <i className="bi bi-person"></i>
                          <div>
                            <strong>Student</strong>
                            <span>{selectedProject.student}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <i className="bi bi-building"></i>
                          <div>
                            <strong>University</strong>
                            <span>{selectedProject.university}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <i className="bi bi-clock"></i>
                          <div>
                            <strong>Duration</strong>
                            <span>{selectedProject.duration}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <i className="bi bi-bar-chart"></i>
                          <div>
                            <strong>Difficulty</strong>
                            <span className={`difficulty ${selectedProject.difficulty.toLowerCase()}`}>
                              {selectedProject.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>

                      {selectedProject.achievements && selectedProject.achievements.length > 0 && (
                        <div className="achievements-card">
                          <h4>Achievements</h4>
                          {selectedProject.achievements.map((achievement, idx) => (
                            <div key={idx} className="achievement-item">
                              <i className="bi bi-trophy"></i>
                              <span>{achievement}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="project-links">
                        {selectedProject.github && (
                          <a href={selectedProject.github} target="_blank" rel="noopener noreferrer" className="project-link">
                            <i className="bi bi-github"></i>
                            View Code
                          </a>
                        )}
                        {selectedProject.liveDemo && (
                          <a href={selectedProject.liveDemo} target="_blank" rel="noopener noreferrer" className="project-link demo">
                            <i className="bi bi-play-circle"></i>
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
    </div>
  );
};

export default ProjectShowcase;
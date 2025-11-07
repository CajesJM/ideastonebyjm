import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Style/ProjectShowcase.css';

const ProjectShowcase = () => {
  const navigate = useNavigate();
  

  const projects = [
    {
      id: 1,
      title: "EcoTrack - Sustainability Monitor",
      category: "Web Application",
      description: "A real-time environmental monitoring system that tracks carbon footprint and suggests eco-friendly alternatives.",
      technologies: ["React", "Node.js", "MongoDB", "Chart.js"],
      image: "🌱",
      status: "Completed",
      rating: 4.9,
      student: "Sarah M.",
      features: ["Real-time Analytics", "Carbon Calculator", "Personalized Recommendations"]
    },
    {
      id: 2,
      title: "MedAssist AI",
      category: "AI/ML Project",
      description: "Machine learning platform that helps medical students diagnose cases through interactive learning modules.",
      technologies: ["Python", "TensorFlow", "FastAPI", "React"],
      image: "🏥",
      status: "In Progress",
      rating: 4.8,
      student: "Alex K.",
      features: ["AI Diagnosis", "Case Studies", "Progress Tracking"]
    },
    {
      id: 3,
      title: "CampusConnect",
      category: "Mobile App",
      description: "University social platform connecting students with similar academic interests and project goals.",
      technologies: ["React Native", "Firebase", "Node.js"],
      image: "🎓",
      status: "Completed",
      rating: 4.7,
      student: "James L.",
      features: ["Interest Matching", "Project Collaboration", "Event Planning"]
    },
    {
      id: 4,
      title: "SmartInventory Pro",
      category: "Desktop Application",
      description: "AI-powered inventory management system with predictive analytics for small businesses.",
      technologies: ["Java", "Spring Boot", "MySQL", "Python"],
      image: "📊",
      status: "Completed",
      rating: 5.0,
      student: "Maria S.",
      features: ["Predictive Analytics", "Barcode Scanning", "Sales Forecasting"]
    },
    {
      id: 5,
      title: "VR Learning Lab",
      category: "VR/AR Project",
      description: "Virtual reality platform for immersive STEM education and interactive lab experiments.",
      technologies: ["Unity", "C#", "Oculus SDK", "Blender"],
      image: "👓",
      status: "In Progress",
      rating: 4.6,
      student: "David T.",
      features: ["3D Simulations", "Interactive Labs", "Progress Analytics"]
    },
    {
      id: 6,
      title: "FarmTech Analytics",
      category: "IoT Project",
      description: "IoT-based smart farming system monitoring soil conditions, weather, and crop health in real-time.",
      technologies: ["Arduino", "Python", "React", "AWS IoT"],
      image: "🚜",
      status: "Completed",
      rating: 4.9,
      student: "Rachel G.",
      features: ["Soil Sensors", "Weather Integration", "Crop Health Monitoring"]
    }
  ];

  const categories = ["All", "Web Application", "Mobile App", "AI/ML Project", "Desktop Application", "VR/AR Project", "IoT Project"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects = selectedCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <div className="showcase-page">
      {/* Background Elements */}
      <div className="showcase-background">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
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
            <h1 className="showcase-title">
              Project <span className="gradient-text">Showcase</span>
            </h1>
            <p className="showcase-subtitle">
              Discover amazing capstone projects built by students using IdeaStone
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

        {/* Category Filter */}
        <section className="category-section">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="category-filter"
          >
            <h3>Filter by Category</h3>
            <div className="category-buttons">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Projects Grid */}
        <section className="projects-section">
          <div className="projects-grid">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="project-card"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="project-header">
                  <div className="project-image">
                    {project.image}
                  </div>
                  <div className="project-badge">
                    <span className={`status-badge ${project.status.toLowerCase().replace(' ', '-')}`}>
                      {project.status}
                    </span>
                    <div className="project-rating">
                      <i className="bi bi-star-fill"></i>
                      {project.rating}
                    </div>
                  </div>
                </div>

                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-category">{project.category}</p>
                  <p className="project-description">{project.description}</p>
                  
                  <div className="project-features">
                    {project.features.map((feature, idx) => (
                      <span key={idx} className="feature-tag">
                        <i className="bi bi-check-circle"></i>
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="technologies-list">
                    {project.technologies.map(tech => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>

                  <div className="project-footer">
                    <div className="student-info">
                      <i className="bi bi-person-circle"></i>
                      {project.student}
                    </div>
                    <motion.button
                      className="view-details-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Details
                      <i className="bi bi-arrow-up-right"></i>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
            <h2>Ready to Create Your Own Success Story?</h2>
            <p>Join these talented students and build your dream capstone project with IdeaStone</p>
            <div className="cta-buttons">
              <motion.button
                onClick={() => navigate('/')}
                className="cta-button primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Project
                <i className="bi bi-lightning"></i>
              </motion.button>
              <motion.button
                onClick={() => navigate('/support')}
                className="cta-button secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Help
                <i className="bi bi-chat-dots"></i>
              </motion.button>
            </div>
          </motion.div>
        </section>
      </motion.div>
    </div>
  );
};

export default ProjectShowcase;
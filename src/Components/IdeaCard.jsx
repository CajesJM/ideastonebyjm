import { useState, useEffect, useRef } from 'react';
import '../Style/IdeaCard.css';

function IdeaCard({ idea, index }) {
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    details: false,
    technologies: false,
    similar: false
  });
  const [imageError, setImageError] = useState(false);

  const cardRef = useRef(null);

  useEffect(() => {
    // Intersection Observer for scroll animations only
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('card-visible');
            if (index !== undefined) {
              entry.target.style.animationDelay = `${index * 0.1}s`;
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [index]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Parse similar projects
  let similar = [];
  if (Array.isArray(idea.similarProjects)) {
    similar = idea.similarProjects;
  } else if (typeof idea.similarProjects === 'string') {
    try {
      similar = JSON.parse(idea.similarProjects);
    } catch (e) {
      console.error('Failed to parse similarProjects JSON:', e);
    }
  }

  const getIndustryIcon = (industry) => {
    const iconMap = {
      'Healthcare': 'bi-hospital',
      'Education': 'bi-book',
      'Finance': 'bi-currency-dollar',
      'E-commerce': 'bi-cart',
      'Entertainment': 'bi-film',
      'Gaming': 'bi-controller',
      'Agriculture': 'bi-tree',
      'Transportation': 'bi-truck',
      'Environment': 'bi-globe'
    };
    return iconMap[industry] || 'bi-building';
  };

  const getTypeIcon = (type) => {
    const iconMap = {
      'Web App': 'bi-globe',
      'Mobile App': 'bi-phone',
      'Desktop App': 'bi-laptop',
      'AI/ML': 'bi-cpu',
      'IoT': 'bi-wifi',
      'Game': 'bi-controller',
      'Data Science': 'bi-graph-up',
      'Blockchain': 'bi-link-45deg',
      'Cybersecurity': 'bi-shield-lock'
    };
    return iconMap[type] || 'bi-grid';
  };

  const getDifficultyColor = (difficulty) => {
    const colorMap = {
      'Beginner': '#10b981',
      'Intermediate': '#f59e0b',
      'Advanced': '#ef4444',
      'Expert': '#8b5cf6'
    };
    return colorMap[difficulty] || '#6b7280';
  };

  const getDurationText = (duration) => {
    const durationMap = {
      'Short-term': '1-3 months',
      'Medium': '3-6 months',
      'Long-term': '6-12+ months'
    };
    return durationMap[duration] || duration;
  };

  const getDurationIcon = (duration) => {
    const iconMap = {
      'Short-term': 'bi-lightning',
      'Medium': 'bi-calendar-week',
      'Long-term': 'bi-calendar-month'
    };
    return iconMap[duration] || 'bi-clock';
  };

  return (
    <div
      className="idea-card"
      ref={cardRef}
    >
      {/* Card Header with Image and Title */}
      <div className="card-header">
        <div className="idea-image-container">
          {!imageError && idea.imageUrl ? (
            <img
              src={idea.imageUrl}
              alt={idea.title}
              className="idea-image"
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              className="idea-image-placeholder"
              style={{
                background: `linear-gradient(135deg, ${getDifficultyColor(idea.difficulty)}20, ${getDifficultyColor(idea.difficulty)}40)`
              }}
            >
              <div className="placeholder-icon">
                <i className="bi bi-lightbulb"></i>
              </div>
            </div>
          )}
        </div>

        <div className="idea-title-section">
          <h2 className="idea-title">{idea.title}</h2>
          <div className="idea-meta-badges">
            <span
              className="difficulty-badge"
              style={{
                backgroundColor: getDifficultyColor(idea.difficulty)
              }}
            >
              <span className="badge-dot"></span>
              {idea.difficulty}
            </span>
            <span className="duration-badge">
              <i className={`bi ${getDurationIcon(idea.duration)}`}></i>
              {getDurationText(idea.duration)}
            </span>
            <span className="type-badge">
              <i className={`bi ${getTypeIcon(idea.type)}`}></i>
              {idea.type}
            </span>
          </div>
        </div>
      </div>

      {/* Expandable Content Sections */}
      <div className="idea-sections">
        {/* Description Section */}
        <div className="idea-section">
          <div
            className="section-header"
            onClick={() => toggleSection('description')}
          >
            <div className="section-title">
              <div className="section-icon">
                <i className="bi bi-text-paragraph"></i>
              </div>
              <span>Description</span>
            </div>
            <div className="section-controls">
              <i className={`bi bi-chevron-${expandedSections.description ? 'up' : 'down'}`}></i>
            </div>
          </div>
          {expandedSections.description && (
            <div className="section-content">
              <p className="idea-description">{idea.description}</p>
            </div>
          )}
        </div>

        {/* Project Details Section */}
        <div className="idea-section">
          <div
            className="section-header"
            onClick={() => toggleSection('details')}
          >
            <div className="section-title">
              <div className="section-icon">
                <i className="bi bi-info-circle"></i>
              </div>
              <span>Project Details</span>
            </div>
            <div className="section-controls">
              <i className={`bi bi-chevron-${expandedSections.details ? 'up' : 'down'}`}></i>
            </div>
          </div>
          {expandedSections.details && (
            <div className="section-content">
              <div className="details-grid">
                <div className="detail-item">
                  <div className="detail-icon">
                    <i className={`bi ${getIndustryIcon(idea.industry)}`}></i>
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Industry</span>
                    <span className="detail-value">{idea.industry || 'Not specified'}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">
                    <i className={`bi ${getTypeIcon(idea.type)}`}></i>
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Project Type</span>
                    <span className="detail-value">{idea.type || 'Not specified'}</span>
                  </div>
                </div>
                {/* Team Roles Section */}
                <div className="detail-item">
                  <div className="detail-icon">
                    <i className="bi bi-people"></i>
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Team Roles</span>
                    <span className="detail-value roles-spacing">
                      {(() => {
                        let rolesArray = [];

                        if (Array.isArray(idea.roles)) {
                          rolesArray = idea.roles;
                        } else if (typeof idea.roles === 'string') {
                          try {
                            rolesArray = JSON.parse(idea.roles);
                          } catch (e) {

                            rolesArray = idea.roles.split(' ').map(role => role.trim());
                          }
                        }
                        rolesArray = Array.isArray(rolesArray)
                          ? rolesArray.filter(role => role && role.trim() !== '')
                          : [];

                        return rolesArray.length > 0
                          ? rolesArray.join(' ')
                          : 'No roles specified';
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Technologies Section */}
        <div className="idea-section">
          <div
            className="section-header"
            onClick={() => toggleSection('technologies')}
          >
            <div className="section-title">
              <div className="section-icon">
                <i className="bi bi-cpu"></i>
              </div>
              <span>Technologies & Skills</span>
            </div>
            <div className="section-controls">
              <i className={`bi bi-chevron-${expandedSections.technologies ? 'up' : 'down'}`}></i>
            </div>
          </div>
          {expandedSections.technologies && (
            <div className="section-content">
              <div className="tech-tags">
                {(() => {
                  let techArray = [];

                  if (Array.isArray(idea.technologies)) {
                    techArray = idea.technologies;
                  } else if (typeof idea.technologies === 'string') {
                    try {
                      let cleanedString = idea.technologies
                        .replace(/iT"/g, '"')
                        .replace(/jT"/g, '"')
                        .replace(/jT\]/g, '"]')
                        .replace(/Y/g, '')
                        .replace(/\\/g, '');

                      techArray = JSON.parse(cleanedString);
                    } catch (e) {
                      console.error('Failed to parse technologies:', e);

                      techArray = idea.technologies.split(',').map(tech =>
                        tech.replace(/iT"/g, '').replace(/jT"/g, '').trim()
                      );
                    }
                  }
                  techArray = techArray.filter(tech =>
                    tech &&
                    tech.trim() !== '' &&
                    tech !== 'iT' &&
                    tech !== 'jT' &&
                    !tech.includes('iT"') &&
                    !tech.includes('jT"')
                  );

                  return techArray.length > 0 ? (
                    techArray.map((tech, index) => (
                      <span key={index} className="tech-tag">
                        {tech}
                      </span>
                    ))
                  ) : (
                    <span className="no-tech">No technologies listed</span>
                  );
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Similar Projects Section */}
        {similar.length > 0 && (
          <div className="idea-section">
            <div
              className="section-header"
              onClick={() => toggleSection('similar')}
            >
              <div className="section-title">
                <div className="section-icon">
                  <i className="bi bi-link-45deg"></i>
                </div>
                <span>Similar Projects & Inspiration</span>
                <span className="project-count">({similar.length})</span>
              </div>
              <div className="section-controls">
                <i className={`bi bi-chevron-${expandedSections.similar ? 'up' : 'down'}`}></i>
              </div>
            </div>
            {expandedSections.similar && (
              <div className="section-content">
                <div className="similar-projects">
                  {similar.map((url, idx) => (
                    <div key={idx} className="similar-project-item">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="similar-project-link"
                      >
                        <i className="bi bi-box-arrow-up-right"></i>
                        <span className="link-text">{url}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card-footer">
        <div className="idea-stats">
          <div className="stat">
            <div className="stat-icon">
              <i className="bi bi-clock"></i>
            </div>
            <div className="stat-content">
              <span className="stat-value centered-value">
                {getDurationText(idea.duration) || 'N/A'}
              </span>
              <span className="stat-label">Duration</span>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon">
              <i className="bi bi-people"></i>
            </div>
            <div className="stat-content">
              <span className="stat-value centered-value">
                {(() => {
                  let rolesArray = [];

                  if (Array.isArray(idea.roles)) {
                    rolesArray = idea.roles;
                  } else if (typeof idea.roles === 'string') {
                    try {
                      rolesArray = JSON.parse(idea.roles);
                    } catch (e) {
                      rolesArray = idea.roles.split(',').map(role => role.trim());
                    }
                  }

                  rolesArray = Array.isArray(rolesArray)
                    ? rolesArray.filter(role => role && role.trim() !== '')
                    : [];

                  return rolesArray.length > 0 ? rolesArray.length : '0';
                })()}
              </span>
              <span className="stat-label">Team Roles</span>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon">
              <i className="bi bi-cpu"></i>
            </div>
            <div className="stat-content">
              <span className="stat-value centered-value">
                {(() => {
                  let techArray = [];

                  if (Array.isArray(idea.technologies)) {
                    techArray = idea.technologies;
                  } else if (typeof idea.technologies === 'string') {
                    try {
                      techArray = JSON.parse(idea.technologies);
                    } catch (e) {
                      techArray = idea.technologies.split(',').map(tech => tech.trim());
                    }
                  }

                  techArray = Array.isArray(techArray)
                    ? techArray.filter(tech => tech && tech.trim() !== '')
                    : [];

                  return techArray.length > 0 ? techArray.length : '0';
                })()}
              </span>
              <span className="stat-label">Technologies</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IdeaCard;
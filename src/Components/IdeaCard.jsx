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
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50));
  const [copiedUrl, setCopiedUrl] = useState(null);

  // Modal states - ADD THESE
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectSetupStep, setProjectSetupStep] = useState(1);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [teamSize, setTeamSize] = useState('Solo');
  const [isCreating, setIsCreating] = useState(false);

  const cardRef = useRef(null);

  useEffect(() => {
    console.log('[IdeaCard] idea prop:', idea);

    // Initialize selected technologies with all idea technologies - ADD THIS
    if (idea.technologies && Array.isArray(idea.technologies)) {
      setSelectedTechnologies([...idea.technologies]);
    }

    // Set default project name - ADD THIS
    setProjectName(`My ${idea.title} Project`);

    // Add intersection observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('card-visible');
            // Staggered animation based on index
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
  }, [idea, index]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
      // Add subtle animation effect
      const btn = e.target.closest('.like-btn');
      if (btn) {
        btn.classList.add('pulse');
        setTimeout(() => btn.classList.remove('pulse'), 600);
      }
    }
    setIsLiked(!isLiked);
  };

  const handleShare = async (e, url = null) => {
    e.stopPropagation();

    if (url) {
      // Copy specific URL to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        setTimeout(() => setCopiedUrl(null), 2000);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopiedUrl(url);
        setTimeout(() => setCopiedUrl(null), 2000);
      }
    } else if (navigator.share) {
      // Use Web Share API if available
      try {
        await navigator.share({
          title: idea.title,
          text: idea.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      const shareText = `${idea.title}\n\n${idea.description}\n\nView more at: ${window.location.href}`;
      try {
        await navigator.clipboard.writeText(shareText);
        // Show copied feedback
        const btn = e.target.closest('.share-btn');
        if (btn) {
          const originalHTML = btn.innerHTML;
          btn.innerHTML = '<i class="bi bi-check"></i> Copied!';
          setTimeout(() => {
            btn.innerHTML = originalHTML;
          }, 2000);
        }
      } catch (err) {
        console.log('Error copying to clipboard:', err);
      }
    }
  };

  // REPLACE THE OLD startProject FUNCTION WITH THIS:
  const startProject = (e) => {
    e.stopPropagation();
    setShowProjectModal(true);
    setProjectSetupStep(1);
  };

  // ADD THESE MODAL FUNCTIONS:
  const closeModal = () => {
    setShowProjectModal(false);
    setProjectSetupStep(1);
    setIsCreating(false);
  };

  const nextStep = () => {
    setProjectSetupStep(prev => prev + 1);
  };

  const prevStep = () => {
    setProjectSetupStep(prev => prev - 1);
  };

  const handleTechnologyToggle = (tech) => {
    setSelectedTechnologies(prev =>
      prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  const completeSetup = async () => {
    setIsCreating(true);

    // Simulate API call to create project
    try {
      // In a real app, you would call your backend API here
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create project object
      const projectData = {
        id: `project_${Date.now()}`,
        name: projectName,
        description: projectDescription,
        template: idea.title,
        technologies: selectedTechnologies,
        teamSize: teamSize,
        difficulty: idea.difficulty,
        type: idea.type,
        status: 'active',
        created: new Date().toISOString(),
        progress: 0
      };

      // Store in localStorage (or send to backend)
      const userProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
      userProjects.push(projectData);
      localStorage.setItem('userProjects', JSON.stringify(userProjects));

      // Show success and redirect
      setTimeout(() => {
        setIsCreating(false);
        alert(`🎉 Project "${projectName}" created successfully!\n\nYou can now start working on your ${idea.title}.`);
        closeModal();

        // Optional: Redirect to project page
        // window.open(`/projects/${projectData.id}`, '_blank');
      }, 500);

    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
      setIsCreating(false);
    }
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

  const getIndustryEmoji = (industry) => {
    const emojiMap = {
      'Healthcare': '🏥',
      'Education': '📚',
      'Finance': '💰',
      'E-commerce': '🛒',
      'Entertainment': '🎬',
      'Gaming': '🎮',
      'Agriculture': '🌾',
      'Transportation': '🚗',
      'Environment': '🌱'
    };
    return emojiMap[industry] || '🌍';
  };

  const getTypeEmoji = (type) => {
    const emojiMap = {
      'Web App': '🌐',
      'Mobile App': '📱',
      'Desktop App': '🖥️',
      'AI/ML': '🤖',
      'IoT': '📡',
      'Game': '🎮',
      'Data Science': '📊',
      'Blockchain': '⛓️',
      'Cybersecurity': '🛡️'
    };
    return emojiMap[type] || '📂';
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

  const getDurationEmoji = (duration) => {
    const emojiMap = {
      'Short-term': '⚡',
      'Medium': '📅',
      'Long-term': '🏗️'
    };
    return emojiMap[duration] || '⏳';
  };

  // Calculate complexity score based on difficulty and duration
  const getComplexityScore = () => {
    const difficultyScores = {
      'Beginner': 1,
      'Intermediate': 2,
      'Advanced': 3,
      'Expert': 4
    };

    const durationScores = {
      'Short-term': 1,
      'Medium': 2,
      'Long-term': 3
    };

    const score = (difficultyScores[idea.difficulty] || 1) * (durationScores[idea.duration] || 1);
    return Math.min(score, 5); // Max score of 5
  };

  // Generate stars based on complexity
  const renderComplexityStars = () => {
    const complexity = getComplexityScore();
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`complexity-star ${i < complexity ? 'active' : ''}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div
      className="idea-card-ultimate"
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background Elements */}
      <div className="card-bg-elements">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="bg-orb orb-3"></div>
      </div>

      {/* Header with Title and Image */}
      <div className="idea-card-header">
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
              <div className="placeholder-title">{idea.title}</div>
            </div>
          )}

          {/* Card Actions Overlay */}
          <div className={`card-actions ${isHovered ? 'visible' : ''}`}>
            <button
              className={`action-btn bookmark-btn ${isBookmarked ? 'active' : ''}`}
              onClick={handleBookmark}
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark idea"}
            >
              <i className={`bi ${isBookmarked ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i>
            </button>
            <button
              className={`action-btn like-btn ${isLiked ? 'active' : ''}`}
              onClick={handleLike}
              aria-label={isLiked ? "Unlike idea" : "Like idea"}
            >
              <i className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
              <span className="like-count">{likeCount}</span>
            </button>
            <button
              className="action-btn share-btn"
              onClick={handleShare}
              aria-label="Share idea"
            >
              <i className="bi bi-share"></i>
            </button>
          </div>

          {/* Complexity Rating */}
          <div className="complexity-rating">
            <span className="complexity-label">Complexity:</span>
            <div className="complexity-stars">
              {renderComplexityStars()}
            </div>
          </div>
        </div>

        <div className="idea-title-section">
          <h2 className="idea-title">{idea.title}</h2>
          <div className="idea-meta-badges">
            <span
              className="difficulty-badge"
              style={{
                backgroundColor: getDifficultyColor(idea.difficulty),
                boxShadow: `0 4px 15px ${getDifficultyColor(idea.difficulty)}40`
              }}
            >
              <span className="badge-dot"></span>
              {idea.difficulty}
            </span>
            <span className="duration-badge">
              {getDurationEmoji(idea.duration)} {idea.duration}
            </span>
            <span className="type-badge">
              {getTypeEmoji(idea.type)} {idea.type}
            </span>
          </div>
        </div>
      </div>

      {/* Expandable Sections */}
      <div className="idea-card-sections">

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
                    {getIndustryEmoji(idea.industry)}
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Industry</span>
                    <span className="detail-value">{idea.industry || 'Not specified'}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">
                    {getTypeEmoji(idea.type)}
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Project Type</span>
                    <span className="detail-value">{idea.type || 'Not specified'}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">
                    <i className="bi bi-people"></i>
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Team Roles</span>
                    <span className="detail-value">
                      {Array.isArray(idea.roles)
                        ? idea.roles.join(', ')
                        : idea.roles || 'No roles specified'
                      }
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
                {Array.isArray(idea.technologies) && idea.technologies.length > 0 ? (
                  idea.technologies.map((tech, index) => (
                    <span key={index} className="tech-tag">
                      {tech}
                    </span>
                  ))
                ) : (
                  <span className="no-tech">No technologies listed</span>
                )}
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
                      <button
                        className="copy-url-btn"
                        onClick={(e) => handleShare(e, url)}
                        aria-label="Copy URL"
                      >
                        <i className={`bi ${copiedUrl === url ? 'bi-check' : 'bi-clipboard'}`}></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Footer with Actions */}
      <div className="idea-card-footer">
        <div className="idea-stats">
          <div className="stat">
            <div className="stat-icon">
              <i className="bi bi-clock"></i>
            </div>
            <div className="stat-content">
              <span className="stat-value">{idea.duration || 'N/A'}</span>
              <span className="stat-label">Duration</span>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon">
              <i className="bi bi-people"></i>
            </div>
            <div className="stat-content">
              <span className="stat-value">{Array.isArray(idea.roles) ? idea.roles.length : 'N/A'}</span>
              <span className="stat-label">Team Roles</span>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon">
              <i className="bi bi-tools"></i>
            </div>
            <div className="stat-content">
              <span className="stat-value">{Array.isArray(idea.technologies) ? idea.technologies.length : '0'}</span>
              <span className="stat-label">Technologies</span>
            </div>
          </div>
        </div>

        <div className="footer-actions">
          <button className="btn-primary" onClick={startProject}>
            <i className="bi bi-rocket"></i>
            Start Project
          </button>
          <button className="btn-secondary" onClick={handleShare}>
            <i className="bi bi-share"></i>
            Share Idea
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {copiedUrl && (
        <div className="copy-notification">
          <i className="bi bi-check-circle"></i>
          URL copied to clipboard!
        </div>
      )}

      {/* ADD THE PROJECT SETUP MODAL HERE */}
      {showProjectModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Start New Project: {idea.title}</h3>
              <button className="modal-close" onClick={closeModal}>
                <i className="bi bi-x"></i>
              </button>
            </div>

            <div className="modal-body">
              {projectSetupStep === 1 && (
                <div className="setup-step">
                  <h4> Project Details</h4>
                  <div className="form-group">
                    <label>Project Name</label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder={`My ${idea.title} Project`}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Describe your project..."
                      className="form-textarea"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              )}

              {projectSetupStep === 2 && (
                <div className="setup-step">
                  <h4>⚙️ Configuration</h4>
                  <div className="tech-stack">
                    <h5>Technologies:</h5>
                    <div className="tech-selection">
                      {idea.technologies && idea.technologies.map((tech, idx) => (
                        <label key={idx} className="tech-option">
                          <input
                            type="checkbox"
                            checked={selectedTechnologies.includes(tech)}
                            onChange={() => handleTechnologyToggle(tech)}
                          />
                          {tech}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {projectSetupStep === 3 && (
                <div className="setup-step">
                  <h4>👥 Team Setup</h4>
                  <div className="form-group">
                    <label>Team Size</label>
                    <div className="form-select-wrapper">
                      <select
                        value={teamSize}
                        onChange={(e) => setTeamSize(e.target.value)}
                        className="form-select"
                      >
                        <option>Solo</option>
                        <option>Small Team (2-4)</option>
                        <option>Medium Team (5-8)</option>
                        <option>Large Team (9+)</option>
                      </select>
                    </div>
                  </div>
                  <div className="project-timeline">
                    <h5>Timeline: {idea.duration}</h5>
                    <p>Estimated completion based on project complexity</p>
                  </div>
                </div>
              )}

              {projectSetupStep === 4 && (
                <div className="setup-step">
                  <h4>🎯 Ready to Start!</h4>
                  <div className="summary">
                    <h5>Project Summary:</h5>
                    <ul>
                      <li><strong>Name:</strong> {projectName}</li>
                      <li><strong>Type:</strong> {idea.type}</li>
                      <li><strong>Difficulty:</strong> {idea.difficulty}</li>
                      <li><strong>Duration:</strong> {idea.duration}</li>
                      <li><strong>Technologies:</strong> {selectedTechnologies.join(', ')}</li>
                      <li><strong>Team:</strong> {teamSize}</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {projectSetupStep > 1 && (
                <button className="btn-secondary" onClick={prevStep}>
                  <i className="bi bi-arrow-left"></i>
                  Back
                </button>
              )}

              {projectSetupStep < 4 ? (
                <button className="btn-primary" onClick={nextStep}>
                  Continue
                  <i className="bi bi-arrow-right"></i>
                </button>
              ) : (
                <button
                  className="btn-success"
                  onClick={completeSetup}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <i className="bi bi-hourglass-split"></i>
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-rocket"></i>
                      Launch Project
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default IdeaCard;
import { useState, useEffect, useRef } from 'react';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from 'react-router-dom';
import IdeaCard from './IdeaCard';
import '../Style/IdeaGenerator.css';

function IdeaGenerator() {
  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    industry: '',
    type: '',
    difficulty: '',
    duration: '',
    search: ''
  });
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const dropdownRefs = useRef({});
  const [enhancements, setEnhancements] = useState(null);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Close dropdown when clicking outside - Updated version
  useEffect(() => {
    const handleClickOutside = (event) => {
      let clickedOutside = true;

      Object.values(dropdownRefs.current).forEach(ref => {
        if (ref && ref.contains(event.target)) {
          clickedOutside = false;
        }
      });

      if (clickedOutside) {
        setActiveDropdown(null);
      }
    };

    // Use click instead of mousedown for better compatibility
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const fetchIdeas = async () => {
    try {
      const params = new URLSearchParams(filters);
      const res = await fetch(`http://127.0.0.1:8000/api/ideas?${params}`);
      const data = await res.json();
      setIdeas(data);
    } catch (err) {
      console.error('Error fetching ideas:', err);
    }
  };

  useEffect(() => {
    setSelectedIdea(null);
    setHistory([]);
    fetchIdeas();
  }, [filters]);

  const generateIdea = () => {
    const filteredIdeas = ideas.filter(idea =>
      (!filters.industry || idea.industry === filters.industry) &&
      (!filters.type || idea.type === filters.type) &&
      (!filters.difficulty || idea.difficulty === filters.difficulty) &&
      (!filters.duration || idea.duration === filters.duration) &&
      (!filters.search || idea.title.toLowerCase().includes(filters.search.toLowerCase()))
    );

    if (isLoading || filteredIdeas.length === 0) return;

    setIsLoading(true);
    setSelectedIdea(null);

    setTimeout(() => {
      try {
        const index = Math.floor(Math.random() * filteredIdeas.length);
        const newIdea = filteredIdeas[index];
        setSelectedIdea(newIdea);
        setHistory(prev => [newIdea, ...prev.slice(0, 7)]);
      } catch (err) {
        console.error('Error generating idea:', err);
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleBackToHomepage = () => {
    navigate('/');
  };

  const copyToClipboard = async () => {
    if (selectedIdea) {
      try {
        await navigator.clipboard.writeText(selectedIdea.title);
        showSimpleToast('Idea copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
        showSimpleToast('❌ Failed to copy idea');
      }
    }
  };

  const showSimpleToast = (message) => {
    const existingToast = document.getElementById('simple-toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.id = 'simple-toast';
    toast.className = 'simple-toast';
    toast.innerHTML = `
    <div class="toast-content">
      <i class="bi bi-clipboard-check"></i>
      <span>${message}</span>
    </div>
  `;
    document.body.appendChild(toast);


    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, 300);
    }, 3000);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setActiveDropdown(null);
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setIsTyping(true);
    setFilters(prev => ({ ...prev, search: value }));

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => setIsTyping(false), 500);
  };
  let typingTimeout;

  const hasFilteredIdeas = ideas.filter(idea =>
    (!filters.industry || idea.industry === filters.industry) &&
    (!filters.type || idea.type === filters.type) &&
    (!filters.difficulty || idea.difficulty === filters.difficulty) &&
    (!filters.duration || idea.duration === filters.duration) &&
    (!filters.search || idea.title.toLowerCase().includes(filters.search.toLowerCase()))
  ).length > 0;

  // Select random emoji for title
  const titleEmojis = ['💎', '🚀', '✨', '🔥', '⭐', '🎯', '⚡'];
  const randomEmoji = titleEmojis[Math.floor(Math.random() * titleEmojis.length)];

  // AI Enhancement Functions
  const generateVariations = (idea) => {
    const baseVariations = [
      `Mobile App: ${idea.title}`,
      `Web Platform: ${idea.title}`,
      `AI-Powered ${idea.title}`,
      `${idea.title} with Real-time Analytics`,
      `Gamified ${idea.title}`,
      `${idea.title} for ${idea.industry} Industry`,
      `Blockchain-Enhanced ${idea.title}`,
      `${idea.title} with IoT Integration`
    ];

    return baseVariations
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  };

  const suggestFeatures = (idea) => {
    const featureTemplates = {
      'Web App': ['User Authentication', 'Admin Dashboard', 'Real-time Chat', 'File Upload', 'Search Functionality', 'Payment Integration', 'Social Sharing', 'Analytics'],
      'Mobile App': ['Push Notifications', 'Offline Mode', 'GPS Integration', 'Camera Access', 'Biometric Login', 'In-app Purchases', 'Dark Mode', 'Sync Across Devices'],
      'AI/ML': ['Predictive Analytics', 'Recommendation Engine', 'Natural Language Processing', 'Computer Vision', 'Sentiment Analysis', 'Automated Reporting', 'Smart Search', 'Pattern Recognition'],
      'default': ['User Profiles', 'Data Visualization', 'Export Functionality', 'Multi-language Support', 'Accessibility Features', 'Performance Monitoring', 'Security Features', 'Backup System']
    };

    const features = featureTemplates[idea.type] || featureTemplates.default;
    return features.sort(() => Math.random() - 0.5).slice(0, 6);
  };

  const suggestImprovements = (idea) => {
    const improvements = [
      "Add machine learning for personalized experiences",
      "Implement real-time collaboration features",
      "Create mobile companion app",
      "Add voice command functionality",
      "Integrate with popular APIs and services",
      "Implement advanced analytics and reporting",
      "Add social media integration",
      "Create admin dashboard for management",
      "Implement push notifications system",
      "Add multi-language support",
      "Create progressive web app version",
      "Implement offline functionality",
      "Add gamification elements",
      "Create API for third-party integrations"
    ];

    return improvements.sort(() => Math.random() - 0.5).slice(0, 4);
  };

  const suggestTechStack = (idea) => {
    const techStacks = {
      'Beginner': {
        frontend: ['React', 'Vue.js', 'HTML/CSS/JS'],
        backend: ['Node.js', 'Express', 'Firebase'],
        database: ['MongoDB', 'SQLite'],
        tools: ['Git', 'VS Code', 'Chrome DevTools']
      },
      'Intermediate': {
        frontend: ['React + TypeScript', 'Next.js', 'Tailwind CSS'],
        backend: ['Django', 'Spring Boot', 'Laravel'],
        database: ['PostgreSQL', 'MySQL', 'MongoDB'],
        tools: ['Docker', 'Postman', 'Jest']
      },
      'Advanced': {
        frontend: ['React Native', 'Angular', 'Svelte'],
        backend: ['NestJS', 'Go', 'Python FastAPI'],
        database: ['Redis', 'Elasticsearch', 'GraphQL'],
        tools: ['Kubernetes', 'AWS', 'CI/CD Pipelines']
      },
      'Expert': {
        frontend: ['WebGL', 'WebAssembly', 'Progressive Web Apps'],
        backend: ['Microservices', 'Serverless', 'Real-time Engines'],
        database: ['Distributed Systems', 'Time-series DB', 'Blockchain'],
        tools: ['Terraform', 'Prometheus', 'Advanced Monitoring']
      }
    };

    return techStacks[idea.difficulty] || techStacks.Beginner;
  };

  const enhanceIdea = async (idea) => {
    setIsEnhancing(true);

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const enhancedIdea = {
      variations: generateVariations(idea),
      features: suggestFeatures(idea),
      improvements: suggestImprovements(idea),
      techStack: suggestTechStack(idea),
      timeline: generateTimeline(idea.difficulty)
    };

    setEnhancements(enhancedIdea);
    setIsEnhancing(false);
  };

  const generateTimeline = (difficulty) => {
    const timelines = {
      'Beginner': ['Week 1-2: Planning & Design', 'Week 3-6: Core Development', 'Week 7-8: Testing & Polish'],
      'Intermediate': ['Week 1: Research & Planning', 'Week 2-4: Backend Development', 'Week 5-7: Frontend Development', 'Week 8: Integration & Testing'],
      'Advanced': ['Sprint 1: Architecture & Setup', 'Sprint 2-3: Core Features', 'Sprint 4: Advanced Features', 'Sprint 5: Testing & Optimization'],
      'Expert': ['Phase 1: Research & Prototyping (2 weeks)', 'Phase 2: Core System (3 weeks)', 'Phase 3: Advanced Features (3 weeks)', 'Phase 4: Polish & Deployment (2 weeks)']
    };

    return timelines[difficulty] || timelines.Beginner;
  };

  const clearEnhancements = () => {
    setEnhancements(null);
  };

  return (
    <div className="idea-generator-container">
      {/* Animated Background Elements */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <header className="app-header-enhanced">
        <div className="header-left">
          <button className="back-btn" onClick={handleBackToHomepage}>
            <i className="bi bi-arrow-left"></i>
            <span>Back to Home</span>
          </button>
        </div>

        <div className="header-center">
          <h1 className="title-wrapper">
            <span className="title-emoji">{randomEmoji}</span>
            <span className="title-gradient">IdeaStone</span>
            <span className="title-emoji">{randomEmoji}</span>
          </h1>
          <p className="subtitle">Generate your next amazing capstone project idea</p>
        </div>

        {/* Right: Search Bar */}
        <div className="header-right">
          <div className="search-container-header">
            <i className={`bi bi-search ${isTyping ? 'pulsing' : ''}`}></i>
            <input
              type="text"
              name="search"
              placeholder="Search ideas..."
              value={filters.search}
              onChange={handleSearchChange}
              className="search-input-header"
            />
            {filters.search && (
              <button
                className="clear-search-header"
                onClick={() => handleFilterChange('search', '')}
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="filters-section">
        <div className="filters-grid">
          {/* Industry Filter */}
          <div
            className={`filter-dropdown ${activeDropdown === 'industry' ? 'active' : ''}`}
            ref={el => dropdownRefs.current.industry = el}
          >
            <div
              className="dropdown-header"
              onClick={() => toggleDropdown('industry')}
            >
              <span className="filter-icon">🌍</span>
              <span className="filter-text">{filters.industry || "All Industries"}</span>
              <span className={`dropdown-arrow ${activeDropdown === 'industry' ? 'rotated' : ''}`}>▼</span>
            </div>
            <div className="dropdown-options">
              <div
                className="option"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleFilterChange('industry', '');
                }}
              >
                🌍 All Industries
              </div>
              {['Healthcare', 'Education', 'Finance', 'E-commerce', 'Entertainment', 'Gaming', 'Agriculture', 'Transportation', 'Environment'].map(industry => (
                <div
                  key={industry}
                  className={`option ${filters.industry === industry ? 'selected' : ''}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFilterChange('industry', industry);
                  }}
                >
                  {industry === 'Healthcare' ? '🏥' :
                    industry === 'Education' ? '📚' :
                      industry === 'Finance' ? '💰' :
                        industry === 'E-commerce' ? '🛒' :
                          industry === 'Entertainment' ? '🎬' :
                            industry === 'Gaming' ? '🎮' :
                              industry === 'Agriculture' ? '🌾' :
                                industry === 'Transportation' ? '🚗' :
                                  industry === 'Environment' ? '🌱' : '🌍'} {industry}
                </div>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div
            className={`filter-dropdown ${activeDropdown === 'type' ? 'active' : ''}`}
            ref={el => dropdownRefs.current.type = el}
          >
            <div
              className="dropdown-header"
              onClick={() => toggleDropdown('type')}
            >
              <span className="filter-icon">📂</span>
              <span className="filter-text">{filters.type || "All Types"}</span>
              <span className={`dropdown-arrow ${activeDropdown === 'type' ? 'rotated' : ''}`}>▼</span>
            </div>
            <div className="dropdown-options">
              <div
                className="option"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleFilterChange('type', '');
                }}
              >
                📂 All Types
              </div>
              {['Web App', 'Mobile App', 'Desktop App', 'AI/ML', 'IoT', 'Game', 'Data Science', 'Blockchain', 'Cybersecurity'].map(type => (
                <div
                  key={type}
                  className={`option ${filters.type === type ? 'selected' : ''}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFilterChange('type', type);
                  }}
                >
                  {type === 'Web App' ? '🌐' :
                    type === 'Mobile App' ? '📱' :
                      type === 'Desktop App' ? '🖥️' :
                        type === 'AI/ML' ? '🤖' :
                          type === 'IoT' ? '📡' :
                            type === 'Game' ? '🎮' :
                              type === 'Data Science' ? '📊' :
                                type === 'Blockchain' ? '⛓️' :
                                  type === 'Cybersecurity' ? '🛡️' : '📂'} {type}
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div
            className={`filter-dropdown ${activeDropdown === 'difficulty' ? 'active' : ''}`}
            ref={el => dropdownRefs.current.difficulty = el}
          >
            <div
              className="dropdown-header"
              onClick={() => toggleDropdown('difficulty')}
            >
              <span className="filter-icon">🎯</span>
              <span className="filter-text">{filters.difficulty || "All Levels"}</span>
              <span className={`dropdown-arrow ${activeDropdown === 'difficulty' ? 'rotated' : ''}`}>▼</span>
            </div>
            <div className="dropdown-options">
              <div
                className="option"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleFilterChange('difficulty', '');
                }}
              >
                🎯 All Levels
              </div>
              {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(difficulty => (
                <div
                  key={difficulty}
                  className={`option ${filters.difficulty === difficulty ? 'selected' : ''}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFilterChange('difficulty', difficulty);
                  }}
                >
                  {difficulty === 'Beginner' ? '🟢' :
                    difficulty === 'Intermediate' ? '🟡' :
                      difficulty === 'Advanced' ? '🔴' :
                        difficulty === 'Expert' ? '💎' : '🎯'} {difficulty}
                </div>
              ))}
            </div>
          </div>

          {/* Duration Filter */}
          <div
            className={`filter-dropdown ${activeDropdown === 'duration' ? 'active' : ''}`}
            ref={el => dropdownRefs.current.duration = el}
          >
            <div
              className="dropdown-header"
              onClick={() => toggleDropdown('duration')}
            >
              <span className="filter-icon">⏳</span>
              <span className="filter-text">{filters.duration || "All Durations"}</span>
              <span className={`dropdown-arrow ${activeDropdown === 'duration' ? 'rotated' : ''}`}>▼</span>
            </div>
            <div className="dropdown-options">
              <div
                className="option"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleFilterChange('duration', '');
                }}
              >
                ⏳ All Durations
              </div>
              {['Short-term', 'Medium', 'Long-term'].map(duration => (
                <div
                  key={duration}
                  className={`option ${filters.duration === duration ? 'selected' : ''}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFilterChange('duration', duration);
                  }}
                >
                  {duration === 'Short-term' ? '⚡' :
                    duration === 'Medium' ? '📅' :
                      duration === 'Long-term' ? '🏗️' : '⏳'} {duration}
                </div>
              ))}
            </div>
          </div>
        </div>


      </div>

      {/* Generate Button */}
      <div className="generate-section">
        <button
          className={`generate-btn-enhanced ${isLoading ? 'loading' : ''} ${!hasFilteredIdeas ? 'disabled' : ''}`}
          onClick={generateIdea}
          disabled={isLoading || !hasFilteredIdeas}
        >
          {isLoading ? (
            <>
              <div className="spinner"></div>
              <span>Generating Your IdeaStone...</span>
            </>
          ) : !hasFilteredIdeas ? (
            <>
              <i className="bi bi-gem"></i>
              <span>No IdeaStones Available</span>
            </>
          ) : (
            <>
              <span>Generate IdeaStone</span>
            </>
          )}
        </button>

        {!isLoading && !hasFilteredIdeas && (
          <div className="no-results-enhanced">
            <i className="bi bi-emoji-frown"></i>
            <p>No capstone ideas found for "<strong>{filters.industry || 'All Industries'}</strong>"</p>
            <p>Try adjusting your filters to discover more ideas!</p>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Idea Display Card */}
        <div className="idea-display-section">
          <div className={`idea-card-container ${selectedIdea ? 'has-idea' : ''} ${isLoading ? 'loading' : ''}`}>
            {selectedIdea ? (
              <>
                <IdeaCard idea={selectedIdea} />
                <div className="idea-actions">
                  <button className="copy-btn-enhanced" onClick={copyToClipboard}>
                    <i className="bi bi-copy"></i>
                    Copy Idea
                  </button>
                  <button className="save-btn">
                    <i className="bi bi-bookmark"></i>
                    Save
                  </button>
                  <button className="share-btn">
                    <i className="bi bi-share"></i>
                    Share
                  </button>
                </div>

                {/* AI Enhancement Section */}
                {selectedIdea && (
                  <div className="ai-enhancement-section">
                    <div className="enhancement-header">
                      <h3>🚀 AI-Powered Enhancements</h3>
                      <p>Get personalized suggestions to level up your project</p>
                    </div>

                    <div className="enhancement-actions">
                      <button
                        className={`enhance-btn ${isEnhancing ? 'loading' : ''}`}
                        onClick={() => enhanceIdea(selectedIdea)}
                        disabled={isEnhancing}
                      >
                        {isEnhancing ? (
                          <>
                            <div className="spinner-small"></div>
                            <span>AI is Enhancing Your Idea...</span>
                          </>
                        ) : (
                          <>
                            <i className="bi bi-robot"></i>
                            <span>Enhance with AI</span>
                          </>
                        )}
                      </button>

                      {enhancements && (
                        <button
                          className="clear-enhancements-btn"
                          onClick={clearEnhancements}
                        >
                          <i className="bi bi-x-circle"></i>
                          Clear
                        </button>
                      )}
                    </div>

                    {enhancements && (
                      <div className="enhancements-grid">
                        {/* Variations */}
                        <div className="enhancement-card">
                          <div className="enhancement-icon">🔄</div>
                          <h4>Project Variations</h4>
                          <div className="enhancement-list">
                            {enhancements.variations.map((variation, idx) => (
                              <div key={idx} className="enhancement-item">
                                <i className="bi bi-lightbulb"></i>
                                <span>{variation}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Features */}
                        <div className="enhancement-card">
                          <div className="enhancement-icon">⭐</div>
                          <h4>Recommended Features</h4>
                          <div className="enhancement-list">
                            {enhancements.features.map((feature, idx) => (
                              <div key={idx} className="enhancement-item">
                                <i className="bi bi-check-circle"></i>
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tech Stack */}
                        <div className="enhancement-card">
                          <div className="enhancement-icon">💻</div>
                          <h4>Tech Stack</h4>
                          <div className="tech-stack">
                            <div className="tech-category">
                              <strong>Frontend:</strong>
                              <div className="tech-tags">
                                {enhancements.techStack.frontend.map((tech, idx) => (
                                  <span key={idx} className="tech-tag">{tech}</span>
                                ))}
                              </div>
                            </div>
                            <div className="tech-category">
                              <strong>Backend:</strong>
                              <div className="tech-tags">
                                {enhancements.techStack.backend.map((tech, idx) => (
                                  <span key={idx} className="tech-tag">{tech}</span>
                                ))}
                              </div>
                            </div>
                            <div className="tech-category">
                              <strong>Database:</strong>
                              <div className="tech-tags">
                                {enhancements.techStack.database.map((tech, idx) => (
                                  <span key={idx} className="tech-tag">{tech}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Improvements */}
                        <div className="enhancement-card">
                          <div className="enhancement-icon">📈</div>
                          <h4>Potential Improvements</h4>
                          <div className="enhancement-list">
                            {enhancements.improvements.map((improvement, idx) => (
                              <div key={idx} className="enhancement-item">
                                <i className="bi bi-arrow-up-right"></i>
                                <span>{improvement}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="enhancement-card">
                          <div className="enhancement-icon">⏰</div>
                          <h4>Development Timeline</h4>
                          <div className="timeline">
                            {enhancements.timeline.map((phase, idx) => (
                              <div key={idx} className="timeline-phase">
                                <div className="phase-number">{idx + 1}</div>
                                <div className="phase-content">
                                  <span>{phase}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>

            ) : (
              <div className="placeholder-enhanced">
                <div className="placeholder-icon">
                  <i className="bi bi-gem"></i>
                </div>
                <h2>Your Capstone Idea Awaits</h2>
                <p>Configure your filters and click "Generate IdeaStone" to discover your next amazing project</p>
                <div className="placeholder-tips">
                  <div className="tip">
                    <i className="bi bi-lightbulb"></i>
                    <span>Try different industry combinations</span>
                  </div>
                  <div className="tip">
                    <i className="bi bi-funnel"></i>
                    <span>Use multiple filters for precise results</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {history.length > 0 && (
          <div className="history-section-enhanced">
            <div className="history-header">

              <h3>Recent IdeaStones</h3>
              <span className="history-count">{history.length}</span>
            </div>
            <div className="history-grid">
              {history.map((idea, idx) => (
                <div
                  key={idx}
                  className="history-card"
                  onClick={() => setSelectedIdea(idea)}
                >
                  <div className="history-card-header">
                    <span className="history-number">#{idx + 1}</span>
                    <span className="history-industry">{idea.industry}</span>
                  </div>
                  <p className="history-title">{idea.title}</p>
                  <div className="history-meta">
                    <span className={`difficulty-badge ${idea.difficulty?.toLowerCase()}`}>
                      {idea.difficulty}
                    </span>
                    <span className="duration-badge">{idea.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <footer className="app-footer">
        <div className="stats">
          <div className="stat">
            <span className="stat-number">{ideas.length}</span>
            <span className="stat-label">Total Ideas</span>
          </div>
          <div className="stat">
            <span className="stat-number">{history.length}</span>
            <span className="stat-label">Generated</span>
          </div>
          <div className="stat">
            <span className="stat-number">
              {filters.industry || filters.type || filters.difficulty || filters.duration ? 'Custom' : 'All'}
            </span>
            <span className="stat-label">Filter</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default IdeaGenerator;
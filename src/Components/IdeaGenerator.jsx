import { useState, useEffect, useRef } from 'react';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../Context/SubscriptionContext';
import IdeaCard from './IdeaCard';
import '../Style/IdeaGenerator.css';

function IdeaGenerator() {
  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);

  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('ideastone_recent_ideas');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

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
  const [savedIdeas, setSavedIdeas] = useState([]);
  const [hasEnhancedCurrentIdea, setHasEnhancedCurrentIdea] = useState(false);
  const [showSavedIdeas, setShowSavedIdeas] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('savedIdeas');
    if (saved) {
      setSavedIdeas(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (selectedIdea) {
      setHasEnhancedCurrentIdea(false);
      setEnhancements(null);
    }
  }, [selectedIdea]);

  const {
    canGenerate,
    incrementGeneration,
    getRemainingGenerations,
    isSubscribed,
    generationCount,
    currentPlan,
    hasNoPlan
  } = useSubscription();

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
    fetchIdeas();

    const isMakingSignificantChange =
      (filters.search && !selectedIdea) ||
      (filters.industry && filters.industry !== selectedIdea?.industry) ||
      (filters.type && filters.type !== selectedIdea?.type) ||
      (filters.difficulty && filters.difficulty !== selectedIdea?.difficulty) ||
      (filters.duration && filters.duration !== selectedIdea?.duration);

    if (isMakingSignificantChange) {
      setSelectedIdea(null);
    }
  }, [filters]);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('ideastone_recent_ideas');
    showSimpleToast('Recent ideas cleared');
  };

  const generateIdea = async () => {
  console.log('🎯 generateIdea function CALLED');
  
  if (!canGenerate()) {
    console.log('❌ Cannot generate - limit reached');
    showSimpleToast(`Generation limit reached! ${hasNoPlan ? 'Activate free plan to get started.' : isSubscribed ? 'Monthly limit exceeded.' : 'Subscribe for more ideas.'}`);
    return;
  }
  
  console.log('✅ Can generate, proceeding...');

  const filteredIdeas = ideas.filter(idea =>
    (!filters.industry || idea.industry === filters.industry) &&
    (!filters.type || idea.type === filters.type) &&
    (!filters.difficulty || idea.difficulty === filters.difficulty) &&
    (!filters.duration || idea.duration === filters.duration) &&
    (!filters.search || idea.title.toLowerCase().includes(filters.search.toLowerCase()))
  );

  console.log('📊 Filtered ideas count:', filteredIdeas.length);
  console.log('🔄 isLoading:', isLoading);

  if (isLoading || filteredIdeas.length === 0) {
    console.log('❌ Cannot generate - loading or no filtered ideas');
    return;
  }

  setIsLoading(true);
  setSelectedIdea(null);
  setEnhancements(null);
  setHasEnhancedCurrentIdea(false);

  try {
    console.log('⏳ Waiting for timeout...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const index = Math.floor(Math.random() * filteredIdeas.length);
    const newIdea = filteredIdeas[index];
    console.log('🎲 Selected idea:', newIdea.title);

    const updatedHistory = [newIdea, ...history.slice(0, 7)];
    setHistory(updatedHistory);
    localStorage.setItem('ideastone_recent_ideas', JSON.stringify(updatedHistory));

    setSelectedIdea(newIdea);

    console.log('📞 CALLING incrementGeneration NOW...');
    const newCount = await incrementGeneration();
    console.log('✅ incrementGeneration COMPLETED. New count:', newCount);

    const remaining = getRemainingGenerations();
    console.log('📊 Remaining generations:', remaining);
    
    if (remaining !== 'Unlimited') {
      showSimpleToast(`Idea generated! ${remaining} ${remaining === 1 ? 'generation' : 'generations'} remaining`);
    } else {
      showSimpleToast('Idea generated! Unlimited generations remaining');
    }
  } catch (error) {
    console.error('❌ Error generating idea:', error);
  } finally {
    console.log('🏁 Setting isLoading to false');
    setIsLoading(false);
  }
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
        showSimpleToast('Failed to copy idea');
      }
    }
  };

  const saveIdea = () => {
    if (!selectedIdea) return;

    const ideaToSave = {
      ...selectedIdea,
      id: selectedIdea.id || Date.now(),
      savedAt: new Date().toISOString(),
      enhancements: enhancements
    };

    const isAlreadySaved = savedIdeas.some(idea =>
      idea.id === ideaToSave.id || idea.title === ideaToSave.title
    );

    if (isAlreadySaved) {
      const updatedSavedIdeas = savedIdeas.filter(idea =>
        !(idea.id === ideaToSave.id || idea.title === ideaToSave.title)
      );
      setSavedIdeas(updatedSavedIdeas);
      localStorage.setItem('savedIdeas', JSON.stringify(updatedSavedIdeas));
      showSimpleToast('Idea removed from saved ideas!');
    } else {
      const updatedSavedIdeas = [ideaToSave, ...savedIdeas];
      setSavedIdeas(updatedSavedIdeas);
      localStorage.setItem('savedIdeas', JSON.stringify(updatedSavedIdeas));
      showSimpleToast('Idea saved successfully!');
    }
  };

  const removeSavedIdea = (ideaToRemove) => {
    const updatedSavedIdeas = savedIdeas.filter(idea =>
      !(idea.id === ideaToRemove.id && idea.title === ideaToRemove.title)
    );
    setSavedIdeas(updatedSavedIdeas);
    localStorage.setItem('savedIdeas', JSON.stringify(updatedSavedIdeas));
    showSimpleToast('Idea removed from saved ideas!');
  };

  const loadSavedIdea = (savedIdea) => {
    setSelectedIdea(savedIdea);
    setShowSavedIdeas(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const shareIdea = async () => {
    if (!selectedIdea) return;

    const shareText = `Check out this capstone project idea: "${selectedIdea.title}"\n\nIndustry: ${selectedIdea.industry}\nType: ${selectedIdea.type}\nDifficulty: ${selectedIdea.difficulty}\nDuration: ${selectedIdea.duration}\n\nGenerated with IdeaStone - Your capstone project idea generator!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Capstone Project Idea',
          text: shareText,
          url: window.location.href,
        });
        showSimpleToast('Idea shared successfully!');
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
          fallbackShare(shareText);
        }
      }
    } else {
      fallbackShare(shareText);
    }
  };

  const fallbackShare = (shareText) => {
    navigator.clipboard.writeText(shareText).then(() => {
      showSimpleToast('Idea details copied to clipboard! Share it with your friends.');
    }).catch(() => {
      alert(`Share this idea:\n\n${shareText}`);
    });
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
      <i class="bi bi-caret-left-fill"></i>
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

  const isIdeaSaved = selectedIdea && savedIdeas.some(idea =>
    idea.id === selectedIdea.id || idea.title === selectedIdea.title
  );

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
    if (hasEnhancedCurrentIdea) {
      showSimpleToast('You have already enhanced this idea!');
      return;
    }
    setIsEnhancing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const enhancedIdea = {
      variations: generateVariations(idea),
      features: suggestFeatures(idea),
      improvements: suggestImprovements(idea),
      techStack: suggestTechStack(idea),
      timeline: generateTimeline(idea.difficulty)
    };

    setEnhancements(enhancedIdea);
    setHasEnhancedCurrentIdea(true);
    setIsEnhancing(false);
    showSimpleToast('Idea enhanced with AI!');
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
    setHasEnhancedCurrentIdea(false);
    showSimpleToast('Enhancements cleared');
  };

  const getPlanDisplayName = () => {
    if (hasNoPlan) return 'No Plan';
    if (currentPlan?.type === 'free') return 'Free';
    if (currentPlan?.type === 'starter') return 'Starter';
    if (currentPlan?.type === 'pro') return 'Pro';
    if (currentPlan?.type === 'unlimited') return 'Unlimited';
    return 'Premium';
  };

  return (
    <div className="idea-generator-container">

      <header className="app-header-enhanced">
        <div className="header-left">
          <button className="back-btn" onClick={handleBackToHomepage}>
            <i className="bi bi-arrow-left"></i>
            <span>Back to Home</span>
          </button>
        </div>

        <div className="header-center">
          <h1 className="title-gradient">IdeaStone</h1>
          <p className="subtitle">Generate your next amazing capstone project idea</p>
        </div>

        {/* Right: Search Bar and Subscription Status */}
        <div className="header-right">


          {/* Subscription Status */}
          <div className="subscription-status-generator">
            {hasNoPlan ? (
              <span className="no-plan-badge-generator">
                <i className="bi bi-hourglass-split"></i>
                No Plan Activated
              </span>
            ) : isSubscribed ? (
              <span className={`premium-badge-generator ${currentPlan?.type}`}>
                <i className="bi bi-star-fill"></i>
                {getPlanDisplayName()}
                {currentPlan?.type !== 'unlimited' && currentPlan?.type !== 'free' && (
                  <span className="plan-count-generator">
                    {getRemainingGenerations()}
                  </span>
                )}
                {currentPlan?.type === 'free' && (
                  <span className="plan-count-generator">
                    {getRemainingGenerations()}
                  </span>
                )}
              </span>
            ) : (
              <span className="free-badge-generator">
                <i className="bi bi-arrow-repeat"></i>
                {getRemainingGenerations()} gens left
              </span>
            )}
          </div>

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
              <span className="filter-icon"><i className="bi bi-building"></i></span>
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
                <i className="bi bi-building"></i> All Industries
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
                  {industry === 'Healthcare' ? <i className="bi bi-hospital"></i> :
                    industry === 'Education' ? <i className="bi bi-book"></i> :
                      industry === 'Finance' ? <i className="bi bi-currency-dollar"></i> :
                        industry === 'E-commerce' ? <i className="bi bi-cart"></i> :
                          industry === 'Entertainment' ? <i className="bi bi-film"></i> :
                            industry === 'Gaming' ? <i className="bi bi-controller"></i> :
                              industry === 'Agriculture' ? <i className="bi bi-tree"></i> :
                                industry === 'Transportation' ? <i className="bi bi-truck"></i> :
                                  industry === 'Environment' ? <i className="bi bi-globe"></i> : <i className="bi bi-building"></i>} {industry}
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
              <span className="filter-icon"><i className="bi bi-grid"></i></span>
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
                <i className="bi bi-grid"></i> All Types
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
                  {type === 'Web App' ? <i className="bi bi-globe"></i> :
                    type === 'Mobile App' ? <i className="bi bi-phone"></i> :
                      type === 'Desktop App' ? <i className="bi bi-laptop"></i> :
                        type === 'AI/ML' ? <i className="bi bi-cpu"></i> :
                          type === 'IoT' ? <i className="bi bi-wifi"></i> :
                            type === 'Game' ? <i className="bi bi-controller"></i> :
                              type === 'Data Science' ? <i className="bi bi-graph-up"></i> :
                                type === 'Blockchain' ? <i className="bi bi-link-45deg"></i> :
                                  type === 'Cybersecurity' ? <i className="bi bi-shield-lock"></i> : <i className="bi bi-grid"></i>} {type}
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
              <span className="filter-icon"><i className="bi bi-bar-chart"></i></span>
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
                <i className="bi bi-bar-chart"></i> All Levels
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
                  {difficulty === 'Beginner' ? <i className="bi bi-circle-fill text-success"></i> :
                    difficulty === 'Intermediate' ? <i className="bi bi-circle-fill text-warning"></i> :
                      difficulty === 'Advanced' ? <i className="bi bi-circle-fill text-danger"></i> :
                        difficulty === 'Expert' ? <i className="bi bi-diamond-fill text-primary"></i> : <i className="bi bi-bar-chart"></i>} {difficulty}
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
              <span className="filter-icon"><i className="bi bi-clock"></i></span>
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
                <i className="bi bi-clock"></i> All Durations
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
                  {duration === 'Short-term' ? <i className="bi bi-lightning-fill"></i> :
                    duration === 'Medium' ? <i className="bi bi-calendar-week"></i> :
                      duration === 'Long-term' ? <i className="bi bi-calendar-month"></i> : <i className="bi bi-clock"></i>} {duration}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generate Button with Subscription Info */}
      <div className="generate-section">
        <div className="subscription-info-generator">
          <div className="usage-display">
            <span className={`usage-badge ${hasNoPlan ? 'no-plan' : isSubscribed ? 'premium' : 'free'}`}>
              {hasNoPlan ? (
                <>
                  <i className="bi bi-hourglass-split"></i>
                  No Plan Activated
                </>
              ) : isSubscribed ? (
                <>
                  <i className="bi bi-star-fill"></i> &nbsp;
                  {getPlanDisplayName()}
                  {currentPlan?.type !== 'unlimited' && currentPlan?.type !== 'free' && (
                    <span className="plan-count-generator">
                      {getRemainingGenerations()}
                    </span>
                  )}
                  {currentPlan?.type === 'free' && (
                    <span className="plan-count-generator">
                    </span>
                  )}
                </>
              ) : (
                <>
                  <i className="bi bi-arrow-repeat"></i>
                  {getRemainingGenerations()} gens left
                </>
              )}
            </span>
            <span className="generation-count">
              Generations left: <strong>{getRemainingGenerations()}</strong>
            </span>
          </div>
        </div>

        <button
          className={`generate-btn ${isLoading ? 'loading' : ''} ${!hasFilteredIdeas ? 'disabled' : ''} ${!canGenerate() ? 'limit-reached' : ''}`}
          onClick={generateIdea}
          disabled={isLoading || !hasFilteredIdeas || !canGenerate()}
        >
          {isLoading ? (
            <>
              <div className="spinner"></div>
              <span>Generating Idea...</span>
            </>
          ) : !canGenerate() ? (
            <>
              <i className="bi bi-lock"></i>
              <span>{hasNoPlan ? 'Activate Free Plan' : 'Limit Reached - Subscribe'}</span>
            </>
          ) : !hasFilteredIdeas ? (
            <>
              <i className="bi bi-search"></i>
              <span>No Ideas Available</span>
            </>
          ) : (
            <>
              <i className="bi bi-lightning"></i>
              <span>Generate Idea</span>
            </>
          )}
        </button>

        {!canGenerate() && (
          <div className="upgrade-prompt-generator">
            <div className="upgrade-content">
              <i className="bi bi-rocket-takeoff"></i>
              <div className="upgrade-text">
                <h4>{hasNoPlan ? 'Get Started with Free Plan!' : 'Want Unlimited Ideas?'}</h4>
                <p>{hasNoPlan
                  ? 'Activate your free plan to get 10 idea generations and start your capstone journey!'
                  : 'You\'ve reached your free generation limit. Subscribe to unlock unlimited capstone ideas!'}</p>
              </div>
              <button
                className="upgrade-now-btn"
                onClick={() => navigate('/')}
              >
                {hasNoPlan ? 'Activate Free Plan' : 'Upgrade Now'}
              </button>
            </div>
          </div>
        )}

        {!isLoading && !hasFilteredIdeas && (
          <div className="no-results">
            <i className="bi bi-emoji-frown"></i>
            <p>No capstone ideas found for "<strong>{filters.industry || 'All Industries'}</strong>"</p>
            <p>Try adjusting your filters to discover more ideas!</p>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <div className="idea-display-section">
          <div className={`idea-card-container ${selectedIdea ? 'has-idea' : ''} ${isLoading ? 'loading' : ''}`}>
            {selectedIdea ? (
              <>
                <IdeaCard idea={selectedIdea} />
                <div className="idea-actions">
                  <button className="copy-btn" onClick={copyToClipboard}>
                    <i className="bi bi-copy"></i>
                    Copy Idea
                  </button>
                  <button
                    className={`save-btn ${isIdeaSaved ? 'saved' : ''}`}
                    onClick={saveIdea}
                  >
                    <i className={`bi ${isIdeaSaved ? 'bi-bookmark-check-fill' : 'bi-bookmark'}`}></i>
                    {isIdeaSaved ? 'Unsave' : 'Save'}
                  </button>
                  <button className="share-btn" onClick={shareIdea}>
                    <i className="bi bi-share"></i>
                    Share
                  </button>
                </div>

                {/* AI Enhancement Section */}
                {selectedIdea && (
                  <div className="ai-enhancement-section">
                    <div className="enhancement-header">
                      <h3>AI-Powered Enhancements</h3>
                      <p>Get personalized suggestions to level up your project</p>
                    </div>

                    <div className="enhancement-actions">
                      <button
                        className={`enhance-btn ${isEnhancing ? 'loading' : ''} ${hasEnhancedCurrentIdea ? 'used' : ''}`}
                        onClick={() => enhanceIdea(selectedIdea)}
                        disabled={isEnhancing || hasEnhancedCurrentIdea}
                      >
                        {isEnhancing ? (
                          <>
                            <div className="spinner-small"></div>
                            <span>AI is Enhancing Your Idea...</span>
                          </>
                        ) : hasEnhancedCurrentIdea ? (
                          <>
                            <i className="bi bi-check-circle-fill"></i>
                            <span>Enhanced with AI</span>
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
                          <div className="enhancement-icon"><i className="bi bi-arrow-repeat"></i></div>
                          <h4>Project Variations</h4>
                          <div className="enhancement-list">
                            {enhancements.variations.map((variation, idx) => (
                              <div key={idx} className="enhancement-item">
                                <i className="bi bi-lightbulb"></i>
                                <span className="enhancement-label">{variation}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Features */}
                        <div className="enhancement-card">
                          <div className="enhancement-icon"><i className="bi bi-star"></i></div>
                          <h4>Recommended Features</h4>
                          <div className="enhancement-list">
                            {enhancements.features.map((feature, idx) => (
                              <div key={idx} className="enhancement-item">
                                <i className="bi bi-check-circle"></i>
                                <span className="enhancement-label">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tech Stack */}
                        <div className="enhancement-card">
                          <div className="enhancement-icon"><i className="bi bi-laptop"></i></div>
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
                          <div className="enhancement-icon"><i className="bi bi-graph-up"></i></div>
                          <h4>Potential Improvements</h4>
                          <div className="enhancement-list">
                            {enhancements.improvements.map((improvement, idx) => (
                              <div key={idx} className="enhancement-item">
                                <i className="bi bi-arrow-up-right"></i>
                                <span className="enhancement-label">{improvement}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="enhancement-card">
                          <div className="enhancement-icon"><i className="bi bi-clock"></i></div>
                          <h4>Development Timeline</h4>
                          <div className="timeline">
                            {enhancements.timeline.map((phase, idx) => (
                              <div key={idx} className="timeline-phase">
                                <div className="phase-number">{idx + 1}</div>
                                <div className="phase-content">
                                  <span className="enhancement-label">{phase}</span>
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
              <div className="placeholder">
                <div className="placeholder-icon">
                  <i className="bi bi-lightbulb"></i>
                </div>
                <h2>Your Capstone Idea Awaits</h2>
                <p>Configure your filters and click "Generate Idea" to discover your next amazing project</p>
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
        {/* Recent Ideas Section */}
        <div className="history-section">
          <div className="history-header">
            <h3>Recent Ideas</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {history.length > 0 && (
                <button
                  className="clear-history-btn"
                  onClick={clearHistory}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: 'var(--danger)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    cursor: 'pointer'
                  }}
                >
                  <i className="bi bi-trash"></i> Clear
                </button>
              )}
              <span className="history-count">{history.length}</span>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="no-history" style={{
              textAlign: 'center',
              padding: '20px',
              color: 'var(--text-muted)',
              fontSize: '0.9rem'
            }}>
              <i className="bi bi-hourglass-split" style={{ fontSize: '1.5rem', marginBottom: '10px', opacity: 0.5 }}></i>
              <p>Your recent ideas will appear here</p>
            </div>
          ) : (
            <div className="history-grid">
              {history.map((idea, idx) => (
                <div
                  key={`${idea.id}-${idx}`}
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
          )}
        </div>

      </div>

      {/* Saved Ideas Button */}
      <button
        className="saved-ideas-btn"
        onClick={() => setShowSavedIdeas(!showSavedIdeas)}
      >
        <i className="bi bi-collection"></i>
        <span>Saved Ideas ({savedIdeas.length})</span>
      </button>
      {/* Saved Ideas Section */}
      {showSavedIdeas && (
        <div className="saved-ideas-section">
          <div className="saved-ideas-header">
            <h2>Your Saved Ideas</h2>
            <button
              className="close-saved-ideas"
              onClick={() => setShowSavedIdeas(false)}
            >
              <i className="bi bi-x"></i>
            </button>
          </div>

          {savedIdeas.length === 0 ? (
            <div className="no-saved-ideas">
              <i className="bi bi-bookmark"></i>
              <h3>No saved ideas yet</h3>
              <p>Save ideas you like by clicking the "Save" button when viewing an idea</p>
            </div>
          ) : (
            <div className="saved-ideas-grid">
              {savedIdeas.map((savedIdea, index) => (
                <div key={index} className="saved-idea-card">
                  <div className="saved-idea-content">
                    <h4>{savedIdea.title}</h4>
                    <div className="saved-idea-meta">
                      <span className="saved-industry">{savedIdea.industry}</span>
                      <span className="saved-type">{savedIdea.type}</span>
                      <span className={`saved-difficulty ${savedIdea.difficulty?.toLowerCase()}`}>
                        {savedIdea.difficulty}
                      </span>
                    </div>
                    <div className="saved-idea-actions">
                      <button
                        className="load-saved-idea"
                        onClick={() => loadSavedIdea(savedIdea)}
                      >
                        <i className="bi bi-eye"></i>
                        View
                      </button>
                      <button
                        className="remove-saved-idea"
                        onClick={() => removeSavedIdea(savedIdea)}
                      >
                        <i className="bi bi-trash"></i>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats Footer */}
      <footer className="app-footer">
        <div className="stats">
          <div className="stat">
            <span className="stat-number">{ideas.length}</span>
            <span className="stat-label">Total_Ideas</span>
          </div>
          <div className="stat">
            <span className="stat-number">{generationCount}</span>
            <span className="stat-label">Generated_Today</span>
          </div>
          <div className="stat">
            <span className="stat-number">
              {hasNoPlan ? 'No Plan' : currentPlan?.type === 'free' ? 'Free' : currentPlan?.type === 'starter' ? 'Starter' : currentPlan?.type === 'pro' ? 'Pro' : currentPlan?.type === 'unlimited' ? 'Unlimited' : 'Premium'}
            </span>
            <span className="stat-label">Plan</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default IdeaGenerator;
import { useState, useEffect } from 'react';
import "bootstrap-icons/font/bootstrap-icons.css";
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

  // Fetch ideas from backend, passing filters as query params
  const fetchIdeas = async () => {
    try {
      const params = new URLSearchParams(filters);
      //const res = await fetch(`http://localhost:5000/api/ideas?${params}`);
      const res = await fetch(`http://127.0.0.1:8000/api/ideas?${params}`);
      const data = await res.json();
      console.log('Fetched ideas:', data);
      setIdeas(data);
    } catch (err) {
      console.error('Error fetching ideas:', err);
    }
  };

  useEffect(() => {
    // Clear out any previously selected idea/history when filters change
    setSelectedIdea(null);
    setHistory([]);
    fetchIdeas();
  }, [filters]);

  // Generate a random idea—but only from ideas matching the filters
  const generateIdea = () => {
    console.log('Button clicked');

    const filteredIdeas = ideas.filter(idea =>
      (!filters.industry || idea.industry === filters.industry) &&
      (!filters.type || idea.type === filters.type) &&
      (!filters.difficulty || idea.difficulty === filters.difficulty) &&
      (!filters.duration || idea.duration === filters.duration) &&
      (!filters.search || idea.title.toLowerCase().includes(filters.search.toLowerCase()))
    );

    if (isLoading || filteredIdeas.length === 0) {
      console.warn('No matching ideas available or still loading');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        const index = Math.floor(Math.random() * filteredIdeas.length);
        const newIdea = filteredIdeas[index];
        console.log('Selected idea:', newIdea);
        setSelectedIdea(newIdea);
        setHistory(prev => [newIdea, ...prev.slice(0, 4)]);
      } catch (err) {
        console.error('Error generating idea:', err);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const copyToClipboard = () => {
    if (selectedIdea) {
      navigator.clipboard.writeText(selectedIdea.title);
      alert('Idea copied to clipboard!');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const hasFilteredIdeas = ideas.filter(idea =>
    (!filters.industry || idea.industry === filters.industry) &&
    (!filters.type || idea.type === filters.type) &&
    (!filters.difficulty || idea.difficulty === filters.difficulty) &&
    (!filters.duration || idea.duration === filters.duration) &&
    (!filters.search || idea.title.toLowerCase().includes(filters.search.toLowerCase()))
  ).length > 0;

  return (
    <div className="idea-generator-container">
      <h1 className='title'><i className="bi bi-strava"></i>IdeaStone<i className="bi bi-strava"></i></h1>

      <div className="filters-left">
        <div className="custom-select">
          <div className="selected">
            🌍 {filters.industry || "All Industries"} <span className="arrow">▼</span>
          </div>
          <ul className="options">
            <li onClick={() => handleFilterChange({ target: { name: "industry", value: "" } })}>🌍 All Industries</li>
            <li onClick={() => handleFilterChange({ target: { name: "industry", value: "Healthcare" } })}>🏥 Healthcare</li>
            <li onClick={() => handleFilterChange({ target: { name: "industry", value: "Education" } })}>📚 Education</li>
            <li onClick={() => handleFilterChange({ target: { name: "industry", value: "Finance" } })}>💰 Finance</li>
            <li onClick={() => handleFilterChange({ target: { name: "industry", value: "E-commerce" } })}>🛒 E-commerce</li>
            <li onClick={() => handleFilterChange({ target: { name: "industry", value: "Entertainment" } })}>🎬 Entertainment</li>
            <li onClick={() => handleFilterChange({ target: { name: "industry", value: "Gaming" } })}>🎮 Gaming</li>
            <li onClick={() => handleFilterChange({ target: { name: "industry", value: "Agriculture" } })}>🌾 Agriculture</li>
            <li onClick={() => handleFilterChange({ target: { name: "industry", value: "Transportation" } })}>🚗 Transportation</li>
            <li onClick={() => handleFilterChange({ target: { name: "industry", value: "Environment" } })}>🌱 Environment</li>
          </ul>
        </div>


        <div className="custom-select">
          <div className="selected">
            📂 {filters.type || "All Types"} <span className="arrow">▼</span>
          </div>
          <ul className="options">
            <li onClick={() => handleFilterChange({ target: { name: "type", value: "" } })}>📂 All Types</li>
            <li onClick={() => handleFilterChange({ target: { name: "type", value: "Web App" } })}>🌐 Web App</li>
            <li onClick={() => handleFilterChange({ target: { name: "type", value: "Mobile App" } })}>📱 Mobile App</li>
            <li onClick={() => handleFilterChange({ target: { name: "type", value: "Desktop App" } })}>🖥️ Desktop App</li>
            <li onClick={() => handleFilterChange({ target: { name: "type", value: "AI/ML" } })}>🤖 AI / Machine Learning</li>
            <li onClick={() => handleFilterChange({ target: { name: "type", value: "IoT" } })}>📡 Internet of Things (IoT)</li>
            <li onClick={() => handleFilterChange({ target: { name: "type", value: "Game" } })}>🎮 Game Development</li>
            <li onClick={() => handleFilterChange({ target: { name: "type", value: "Data Science" } })}>📊 Data Science</li>
            <li onClick={() => handleFilterChange({ target: { name: "type", value: "Blockchain" } })}>⛓️ Blockchain</li>
            <li onClick={() => handleFilterChange({ target: { name: "type", value: "Cybersecurity" } })}>🛡️ Cybersecurity</li>
          </ul>
        </div>


        <div className="custom-select">
          <div className="selected">
            🎯 {filters.difficulty || "All Levels"} <span className="arrow">▼</span>
          </div>
          <ul className="options">
            <li onClick={() => handleFilterChange({ target: { name: "difficulty", value: "" } })}>🎯 All Levels</li>
            <li onClick={() => handleFilterChange({ target: { name: "difficulty", value: "Beginner" } })}>🟢 Beginner</li>
            <li onClick={() => handleFilterChange({ target: { name: "difficulty", value: "Intermediate" } })}>🟡 Intermediate</li>
            <li onClick={() => handleFilterChange({ target: { name: "difficulty", value: "Advanced" } })}>🔴 Advanced</li>
            <li onClick={() => handleFilterChange({ target: { name: "difficulty", value: "Expert" } })}>💎 Expert</li>
          </ul>
        </div>
        <div className="custom-select">
          <div className="selected">
            ⏳ {filters.duration || "All Durations"} <span className="arrow">▼</span>
          </div>
          <ul className="options">
            <li onClick={() => handleFilterChange({ target: { name: "duration", value: "" } })}>⏳ All Durations</li>
            <li onClick={() => handleFilterChange({ target: { name: "duration", value: "Short-term" } })}>⚡ Short-term (1–2 months)</li>
            <li onClick={() => handleFilterChange({ target: { name: "duration", value: "Medium" } })}>📅 Medium (3–6 months)</li>
            <li onClick={() => handleFilterChange({ target: { name: "duration", value: "Long-term" } })}>🏗️ Long-term (6+ months)</li>
          </ul>
        </div>
      </div>

      <div className="search-container">
        <i className="bi bi-search"></i>
        <input
          type="text"
          name="search"
          placeholder="Search Title"
          value={filters.search}
          onChange={handleFilterChange}
        />
      </div>

      <br />
      <br />
      <button
        className="generate-btn"
        onClick={generateIdea}
        disabled={isLoading || !hasFilteredIdeas}
      >
        {isLoading
          ? <><i className="bi bi-hourglass-split"></i> &nbsp; &nbsp;&nbsp; Generating... &nbsp;&nbsp;&nbsp; <i className="bi bi-rocket-takeoff"></i></>
          : !hasFilteredIdeas
            ? <><i className="bi bi-ban"></i> No IdeaStone to Generate</>
            : 'Generate IdeaStone'
        }
      </button>
      {!isLoading && !hasFilteredIdeas && (
        <p className="no-results">
          <i className="bi bi-emoji-frown"></i> No capstone ideas found for "<strong>{filters.industry || 'All Industries'}</strong>".
          Try a different filter.
        </p>
      )}

      <div className='box-wrapper'>
        <div className="box fade-in">
          {selectedIdea ? (
            <>
              <IdeaCard idea={selectedIdea} />

              <button className="copy-btn" onClick={copyToClipboard}>
                <i className="bi bi-copy"></i> Copy Idea
              </button>
            </>
          ) : (
            <div className="placeholder">
              <h2><i className="bi bi-amd"></i> Your capstone idea will appear here <i className="bi bi-amd"></i></h2>
              <p>Use the filters above and click “<strong>Generate</strong>” to get started.</p>
            </div>
          )}
        </div>

        {history.length > 1 && (
          <div className="history-section">
            <h3><i className="bi bi-clock-fill"></i> Idea History</h3>
            <ul>
              {history.slice(-8).map((idea, idx) => (
                <li key={idx}>{idea.title}</li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}

export default IdeaGenerator;

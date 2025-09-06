import { useState, useEffect } from 'react';
import IdeaCard from './IdeaCard';
import './IdeaGenerator.css';

function IdeaGenerator() {
  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    industry: '',
    type: '',
    difficulty: ''
  });

  // Fetch ideas from backend, passing filters as query params
  const fetchIdeas = async () => {
    try {
      const params = new URLSearchParams(filters);
      const res = await fetch(`http://localhost:5000/api/ideas?${params}`);
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

    // Apply client-side filter as a safety net
    const filteredIdeas = ideas.filter(idea =>
      (!filters.industry   || idea.industry   === filters.industry) &&
      (!filters.type       || idea.type       === filters.type) &&
      (!filters.difficulty || idea.difficulty === filters.difficulty)
    );

    // Guard: still loading or no matching ideas
    if (isLoading || filteredIdeas.length === 0) {
      console.warn('No matching ideas available or still loading');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        const index  = Math.floor(Math.random() * filteredIdeas.length);
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

  // Update filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Compute whether we have any ideas to generate, post-filter
  const hasFilteredIdeas = ideas.filter(idea =>
    (!filters.industry   || idea.industry   === filters.industry) &&
    (!filters.type       || idea.type       === filters.type) &&
    (!filters.difficulty || idea.difficulty === filters.difficulty)
  ).length > 0;

  return (
    <div className="idea-generator-container">
      <h1 className='title'>IdeaStone</h1>

      <div className="filters">
        <select name="industry" onChange={handleFilterChange} value={filters.industry}>
          <option value="">All Industries</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Education">Education</option>
        </select>

        <select name="type" onChange={handleFilterChange} value={filters.type}>
          <option value="">All Types</option>
          <option value="Web App">Web App</option>
          <option value="Mobile App">Mobile App</option>
        </select>

        <select name="difficulty" onChange={handleFilterChange} value={filters.difficulty}>
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
        </select>
      </div>

    
      {!isLoading && !hasFilteredIdeas && (
        <p className="no-results">
          😕 No capstone ideas found for “{filters.industry || 'All Industries'}.”
          Try a different filter.
        </p>
      )}

      {/* Generate button */}
      <button
        className="generate-btn"
        onClick={generateIdea}
        disabled={isLoading || !hasFilteredIdeas}
      >
        {isLoading
          ? '⏳ Generating...'
          : !hasFilteredIdeas
            ? '🚫 No ideas to generate'
            : 'Generate Capstone Idea'
        }
      </button>

      {/* Idea display */}
    <div className='box-wrapper'>
    <div className="box fade-in">
  {selectedIdea ? (
    <>
      <IdeaCard idea={selectedIdea} />
      <button className="copy-btn" onClick={copyToClipboard}>
        📋 Copy Idea
      </button>
    </>
  ) : (
    <div className="placeholder">
      <h2>🧠 Your capstone idea will appear here</h2>
      <p>Use the filters above and click “Generate” to get started.</p>
    </div>
  )}
</div>
      
    
      {history.length > 1 && (
        <div className="history-section">
          <h3>🕘 Idea History</h3>
          <ul>
            {history.slice(1,4).map((idea, idx) => (
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
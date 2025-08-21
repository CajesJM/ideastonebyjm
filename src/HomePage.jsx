import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <div className="homepage-overlay">
        <header className="homepage-header">
          <h1 className="homepage-title">💡 IdeaStone</h1>
          <p className="homepage-subtext">
            Spark your next capstone with curated ideas, smart filters, and creative inspiration.
          </p>
        </header>

        <button
          onClick={() => navigate('/generator')}
          className="homepage-button"
        >
          🚀 Get Started
        </button>

        <footer className="homepage-footer">
          &copy; {new Date().getFullYear()} IdeaStone. Built to inspire.
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
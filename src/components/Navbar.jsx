import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, Film, Tv, Sun, Moon } from 'lucide-react';
import { ThemeContext } from '../App';

const Navbar = ({ watchlistCount, activeTab, setActiveTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'movies') {
      navigate('/');
    } else if (tab === 'tv') {
      navigate('/tv');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>MovieApp</h1>
        </div>
        
        <div className="navbar-tabs">
          <button 
            className={`tab-button ${activeTab === 'movies' ? 'active' : ''}`}
            onClick={() => handleTabChange('movies')}
          >
            <Film size={20} />
            Movies
          </button>
          <button 
            className={`tab-button ${activeTab === 'tv' ? 'active' : ''}`}
            onClick={() => handleTabChange('tv')}
          >
            <Tv size={20} />
            TV Shows
          </button>
        </div>

        <div className="navbar-actions">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <Search size={20} />
            </button>
          </form>
          
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button 
            className="watchlist-button"
            onClick={() => navigate('/watchlist')}
          >
            <Heart size={20} />
            {watchlistCount > 0 && (
              <span className="watchlist-count">{watchlistCount}</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
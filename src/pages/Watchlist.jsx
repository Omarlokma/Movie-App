import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Film, Tv } from 'lucide-react';
import MovieCard from '../components/MovieCard';

const Watchlist = ({ watchlist, removeFromWatchlist }) => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredWatchlist = watchlist.filter(item => {
    if (activeFilter === 'all') return true;
    return item.type === activeFilter;
  });

  const movies = watchlist.filter(item => item.type === 'movie');
  const tvShows = watchlist.filter(item => item.type === 'tv');

  const handleRemove = (id, type) => {
    removeFromWatchlist(id, type);
  };

  if (watchlist.length === 0) {
    return (
      <div className="watchlist-page">
        <div className="page-header">
          <h2>My Watchlist</h2>
          <p>Your saved movies and TV shows will appear here</p>
        </div>
        
        <div className="empty-watchlist">
          <div className="empty-icon">💔</div>
          <h3>Your watchlist is empty</h3>
          <p>Start adding movies and TV shows to your watchlist!</p>
          <button 
            className="primary-button"
            onClick={() => navigate('/')}
          >
            Browse Movies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-page">
      <div className="page-header">
        <h2>My Watchlist</h2>
        <p>Your saved movies and TV shows ({watchlist.length} items)</p>
      </div>

      <div className="watchlist-filters">
        <button 
          className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All ({watchlist.length})
        </button>
        <button 
          className={`filter-button ${activeFilter === 'movie' ? 'active' : ''}`}
          onClick={() => setActiveFilter('movie')}
        >
          <Film size={16} />
          Movies ({movies.length})
        </button>
        <button 
          className={`filter-button ${activeFilter === 'tv' ? 'active' : ''}`}
          onClick={() => setActiveFilter('tv')}
        >
          <Tv size={16} />
          TV Shows ({tvShows.length})
        </button>
      </div>

      <div className="watchlist-grid">
        {filteredWatchlist.map(item => (
          <div key={`${item.type}-${item.id}`} className="watchlist-item">
            <MovieCard
              movie={item}
              addToWatchlist={() => {}} // No-op since it's already in watchlist
              isInWatchlist={() => true}
              type={item.type}
            />
            <button 
              className="remove-button"
              onClick={() => handleRemove(item.id, item.type)}
              title={`Remove ${item.title} from watchlist`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {filteredWatchlist.length === 0 && (
        <div className="no-results">
          <p>No {activeFilter === 'all' ? '' : activeFilter} items in your watchlist.</p>
          <button 
            className="secondary-button"
            onClick={() => setActiveFilter('all')}
          >
            View All Items
          </button>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
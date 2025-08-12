import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

const MovieCard = ({ movie, addToWatchlist, isInWatchlist, type = 'movie' }) => {
  const navigate = useNavigate();
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

  const handleWatchlistToggle = (e) => {
    e.stopPropagation();
    addToWatchlist({
      id: movie.id,
      title: movie.title || movie.name,
      poster_path: movie.poster_path,
      type: type
    });
  };

  const handleCardClick = () => {
    if (type === 'movie') {
      navigate(`/movie/${movie.id}`);
    } else {
      navigate(`/tv/${movie.id}`);
    }
  };

  return (
    <div className="movie-card" onClick={handleCardClick}>
      <div className="movie-poster">
        {movie.poster_path ? (
          <img 
            src={`${imageBaseUrl}${movie.poster_path}`} 
            alt={movie.title || movie.name}
            loading="lazy"
          />
        ) : (
          <div className="no-poster">
            <span>No Image</span>
          </div>
        )}
        <button 
          className={`watchlist-toggle ${isInWatchlist(movie.id, type) ? 'in-watchlist' : ''}`}
          onClick={handleWatchlistToggle}
        >
          <Heart size={20} />
        </button>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title || movie.name}</h3>
        <p className="movie-year">
          {movie.release_date ? new Date(movie.release_date).getFullYear() : 
           movie.first_air_date ? new Date(movie.first_air_date).getFullYear() : 'N/A'}
        </p>
        <div className="movie-rating">
          <span className="rating-text">
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
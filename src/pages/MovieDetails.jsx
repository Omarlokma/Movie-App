import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Star, Calendar, Clock, ArrowLeft } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import apiService from '../services/api';

const MovieDetails = ({ addToWatchlist, isInWatchlist }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [movieData, recommendationsData, reviewsData] = await Promise.all([
        apiService.getMovieDetails(id),
        apiService.getMovieRecommendations(id),
        apiService.getMovieReviews(id)
      ]);
      
      setMovie(movieData);
      setRecommendations(recommendationsData.results.slice(0, 6));
      setReviews(reviewsData.results);
    } catch (err) {
      setError('Failed to fetch movie details. Please try again.');
      console.error('Error fetching movie details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchlistToggle = () => {
    addToWatchlist({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      type: 'movie'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="error-container">
        <p>{error || 'Movie not found'}</p>
        <button onClick={() => navigate('/')}>Go Back</button>
      </div>
    );
  }

  const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  return (
    <div className="movie-details-page">
      <button 
        className="back-button"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="movie-hero" style={{
        backgroundImage: backdropUrl ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${backdropUrl})` : 'none'
      }}>
        <div className="movie-hero-content">
          <div className="movie-poster-large">
            {movie.poster_path ? (
              <img 
                src={`${imageBaseUrl}${movie.poster_path}`} 
                alt={movie.title}
              />
            ) : (
              <div className="no-poster-large">
                <span>No Image</span>
              </div>
            )}
          </div>
          
          <div className="movie-info-large">
            <div className="movie-header">
              <h1>{movie.title}</h1>
              <button 
                className={`watchlist-button-large ${isInWatchlist(movie.id, 'movie') ? 'in-watchlist' : ''}`}
                onClick={handleWatchlistToggle}
              >
                <Heart size={24} />
              </button>
            </div>
            
            <div className="movie-meta">
              <div className="meta-item">
                <Star size={16} />
                <span>{movie.vote_average?.toFixed(1) || 'N/A'}</span>
              </div>
              <div className="meta-item">
                <Calendar size={16} />
                <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
              </div>
              <div className="meta-item">
                <Clock size={16} />
                <span>{movie.runtime ? `${movie.runtime} min` : 'N/A'}</span>
              </div>
            </div>
            
            <p className="movie-overview">{movie.overview}</p>
            
            <div className="movie-genres">
              {movie.genres?.map(genre => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="movie-content">
        <div className="content-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({reviews.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
          >
            Recommendations
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-content">
              <h3>Plot Summary</h3>
              <p>{movie.overview}</p>
              
              {movie.budget && movie.budget > 0 && (
                <div className="movie-stats">
                  <h3>Production Details</h3>
                  <p><strong>Budget:</strong> ${movie.budget.toLocaleString()}</p>
                  {movie.revenue && movie.revenue > 0 && (
                    <p><strong>Revenue:</strong> ${movie.revenue.toLocaleString()}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-content">
              {reviews.length > 0 ? (
                reviews.map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <h4>{review.author}</h4>
                      <div className="review-rating">
                        <Star size={16} />
                        <span>{review.author_details?.rating || 'N/A'}</span>
                      </div>
                    </div>
                    <p className="review-content">{review.content}</p>
                  </div>
                ))
              ) : (
                <p>No reviews available for this movie.</p>
              )}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="recommendations-content">
              <h3>You might also like</h3>
              <div className="recommendations-grid">
                {recommendations.map(movie => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    addToWatchlist={addToWatchlist}
                    isInWatchlist={isInWatchlist}
                    type="movie"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
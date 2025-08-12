import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Star, Calendar, Clock, ArrowLeft } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import apiService from '../services/api';

const TVShowDetails = ({ addToWatchlist, isInWatchlist }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tvShow, setTvShow] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchTVShowDetails();
  }, [id]);

  const fetchTVShowDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [tvShowData, recommendationsData, reviewsData] = await Promise.all([
        apiService.getTVShowDetails(id),
        apiService.getTVShowRecommendations(id),
        apiService.getTVShowReviews(id)
      ]);
      
      setTvShow(tvShowData);
      setRecommendations(recommendationsData.results.slice(0, 6));
      setReviews(reviewsData.results);
    } catch (err) {
      setError('Failed to fetch TV show details. Please try again.');
      console.error('Error fetching TV show details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchlistToggle = () => {
    addToWatchlist({
      id: tvShow.id,
      title: tvShow.name,
      poster_path: tvShow.poster_path,
      type: 'tv'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading TV show details...</p>
      </div>
    );
  }

  if (error || !tvShow) {
    return (
      <div className="error-container">
        <p>{error || 'TV show not found'}</p>
        <button onClick={() => navigate('/tv')}>Go Back</button>
      </div>
    );
  }

  const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  const backdropUrl = tvShow.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`
    : null;

  return (
    <div className="tv-show-details-page">
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
            {tvShow.poster_path ? (
              <img 
                src={`${imageBaseUrl}${tvShow.poster_path}`} 
                alt={tvShow.name}
              />
            ) : (
              <div className="no-poster-large">
                <span>No Image</span>
              </div>
            )}
          </div>
          
          <div className="movie-info-large">
            <div className="movie-header">
              <h1>{tvShow.name}</h1>
              <button 
                className={`watchlist-button-large ${isInWatchlist(tvShow.id, 'tv') ? 'in-watchlist' : ''}`}
                onClick={handleWatchlistToggle}
              >
                <Heart size={24} />
              </button>
            </div>
            
            <div className="movie-meta">
              <div className="meta-item">
                <Star size={16} />
                <span>{tvShow.vote_average?.toFixed(1) || 'N/A'}</span>
              </div>
              <div className="meta-item">
                <Calendar size={16} />
                <span>{tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : 'N/A'}</span>
              </div>
              <div className="meta-item">
                <Clock size={16} />
                <span>{tvShow.episode_run_time?.[0] ? `${tvShow.episode_run_time[0]} min` : 'N/A'}</span>
              </div>
            </div>
            
            <p className="movie-overview">{tvShow.overview}</p>
            
            <div className="movie-genres">
              {tvShow.genres?.map(genre => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>

            {tvShow.number_of_seasons && (
              <div className="tv-show-info">
                <p><strong>Seasons:</strong> {tvShow.number_of_seasons}</p>
                {tvShow.number_of_episodes && (
                  <p><strong>Episodes:</strong> {tvShow.number_of_episodes}</p>
                )}
              </div>
            )}
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
              <p>{tvShow.overview}</p>
              
              {tvShow.networks && tvShow.networks.length > 0 && (
                <div className="tv-show-stats">
                  <h3>Network Information</h3>
                  <p><strong>Network:</strong> {tvShow.networks.map(network => network.name).join(', ')}</p>
                  {tvShow.status && (
                    <p><strong>Status:</strong> {tvShow.status}</p>
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
                <p>No reviews available for this TV show.</p>
              )}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="recommendations-content">
              <h3>You might also like</h3>
              <div className="recommendations-grid">
                {recommendations.map(tvShow => (
                  <MovieCard
                    key={tvShow.id}
                    movie={tvShow}
                    addToWatchlist={addToWatchlist}
                    isInWatchlist={isInWatchlist}
                    type="tv"
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

export default TVShowDetails;
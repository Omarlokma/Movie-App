import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import apiService from '../services/api';

const TVShows = ({ addToWatchlist, isInWatchlist }) => {
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const page = parseInt(searchParams.get('page')) || 1;
    setCurrentPage(page);
    fetchTVShows(page);
  }, [searchParams]);

  const fetchTVShows = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getPopularTVShows(page);
      setTvShows(data.results);
      setTotalPages(data.total_pages);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to fetch TV shows. Please try again.');
      console.error('Error fetching TV shows:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const url = new URL(window.location);
      url.searchParams.set('page', newPage);
      window.history.pushState({}, '', url);
      fetchTVShows(newPage);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading TV shows...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => fetchTVShows(currentPage)}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="tv-shows-page">
      <div className="page-header">
        <h2>Popular TV Shows</h2>
        <p>Discover the most popular TV shows</p>
      </div>

      <div className="movies-grid">
        {tvShows.map(tvShow => (
          <MovieCard
            key={tvShow.id}
            movie={tvShow}
            addToWatchlist={addToWatchlist}
            isInWatchlist={isInWatchlist}
            type="tv"
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`pagination-button ${currentPage === pageNum ? 'active' : ''}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TVShows;
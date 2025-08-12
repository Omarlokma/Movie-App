import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import apiService from '../services/api';

const SearchResults = ({ addToWatchlist, isInWatchlist }) => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const query = searchParams.get('q');

  useEffect(() => {
    if (query) {
      const page = parseInt(searchParams.get('page')) || 1;
      setCurrentPage(page);
      fetchSearchResults(query, page);
    }
  }, [query, searchParams]);

  const fetchSearchResults = async (searchQuery, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.searchMovies(searchQuery, page);
      setResults(data.results);
      setTotalPages(data.total_pages);
      setTotalResults(data.total_results);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to fetch search results. Please try again.');
      console.error('Error fetching search results:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const url = new URL(window.location);
      url.searchParams.set('page', newPage);
      window.history.pushState({}, '', url);
      fetchSearchResults(query, newPage);
    }
  };

  if (!query) {
    return (
      <div className="search-results-page">
        <div className="page-header">
          <h2>Search Results</h2>
          <p>Enter a search term to find movies</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Searching for "{query}"...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => fetchSearchResults(query, currentPage)}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="search-results-page">
      <div className="page-header">
        <h2>Search Results</h2>
        <p>
          Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
        </p>
      </div>

      {results.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No movies found</h3>
          <p>Try searching for a different movie title.</p>
        </div>
      ) : (
        <>
          <div className="movies-grid">
            {results.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                addToWatchlist={addToWatchlist}
                isInWatchlist={isInWatchlist}
                type="movie"
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
        </>
      )}
    </div>
  );
};

export default SearchResults;
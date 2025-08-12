const API_KEY = '649baf4570a4f5286bcc9f8d19ab3867';
const BASE_URL = 'https://api.themoviedb.org/3';

class ApiService {
  async fetchData(endpoint, params = {}) {
    try {
      const urlParams = new URLSearchParams({
        api_key: API_KEY,
        ...params
      });
      const response = await fetch(`${BASE_URL}${endpoint}?${urlParams}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Movies
  async getNowPlayingMovies(page = 1) {
    return this.fetchData('/movie/now_playing', { page });
  }

  async getPopularMovies(page = 1) {
    return this.fetchData('/movie/popular', { page });
  }

  async getMovieDetails(movieId) {
    return this.fetchData(`/movie/${movieId}`);
  }

  async getMovieRecommendations(movieId) {
    return this.fetchData(`/movie/${movieId}/recommendations`);
  }

  async getMovieReviews(movieId) {
    return this.fetchData(`/movie/${movieId}/reviews`);
  }

  async searchMovies(query, page = 1) {
    return this.fetchData('/search/movie', { 
      query: encodeURIComponent(query), 
      page 
    });
  }

  // TV Shows
  async getPopularTVShows(page = 1) {
    return this.fetchData('/tv/popular', { page });
  }

  async getTVShowDetails(tvId) {
    return this.fetchData(`/tv/${tvId}`);
  }

  async getTVShowRecommendations(tvId) {
    return this.fetchData(`/tv/${tvId}/recommendations`);
  }

  async getTVShowReviews(tvId) {
    return this.fetchData(`/tv/${tvId}/reviews`);
  }

  async searchTVShows(query, page = 1) {
    return this.fetchData('/search/tv', { 
      query: encodeURIComponent(query), 
      page 
    });
  }
}

export default new ApiService(); 
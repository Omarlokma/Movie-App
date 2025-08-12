import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect, createContext } from 'react';
import Navbar from './components/Navbar';
import MoviesList from './pages/MoviesList';
import MovieDetails from './pages/MovieDetails';
import Watchlist from './pages/Watchlist';
import SearchResults from './pages/SearchResults';
import TVShows from './pages/TVShows';
import TVShowDetails from './pages/TVShowDetails';
import './App.css';

export const ThemeContext = createContext();

function App() {
  const [watchlist, setWatchlist] = useState([]);
  const [activeTab, setActiveTab] = useState('movies');
  const [theme, setTheme] = useState('dark');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedWatchlist = localStorage.getItem('watchlist');
      const savedTheme = localStorage.getItem('theme');
      
      if (savedWatchlist) {
        const parsedWatchlist = JSON.parse(savedWatchlist);

        if (Array.isArray(parsedWatchlist)) {
          setWatchlist(parsedWatchlist);
        }
      }
      
      if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      setWatchlist([]);
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
      } catch (error) {
        console.error('Error saving watchlist to localStorage:', error);
      }
    }
  }, [watchlist, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
      } catch (error) {
        console.error('Error saving theme to localStorage:', error);
      }
    }
  }, [theme, isLoaded]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const addToWatchlist = (item) => {
    setWatchlist(prev => {
      const exists = prev.find(watchlistItem => 
        watchlistItem.id === item.id && watchlistItem.type === item.type
      );
      if (exists) {
        return prev.filter(watchlistItem => 
          !(watchlistItem.id === item.id && watchlistItem.type === item.type)
        );
      } else {
        return [...prev, { ...item }];
      }
    });
  };

  const removeFromWatchlist = (id, type) => {
    setWatchlist(prev => prev.filter(item => 
      !(item.id === id && item.type === type)
    ));
  };

  const isInWatchlist = (id, type) => {
    return watchlist.some(item => item.id === id && item.type === type);
  };

  if (!isLoaded) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <BrowserRouter>
        <div className={`App ${theme}`}>
          <Navbar 
            watchlistCount={watchlist.length} 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <main className="main-content">
            <Routes>
              <Route 
                path="/" 
                element={
                  <MoviesList 
                    addToWatchlist={addToWatchlist}
                    isInWatchlist={isInWatchlist}
                  />
                } 
              />
              <Route 
                path="/movie/:id" 
                element={
                  <MovieDetails 
                    addToWatchlist={addToWatchlist}
                    isInWatchlist={isInWatchlist}
                  />
                } 
              />
              <Route 
                path="/watchlist" 
                element={
                  <Watchlist 
                    watchlist={watchlist}
                    removeFromWatchlist={removeFromWatchlist}
                  />
                } 
              />
              <Route 
                path="/search" 
                element={
                  <SearchResults 
                    addToWatchlist={addToWatchlist}
                    isInWatchlist={isInWatchlist}
                  />
                } 
              />
              <Route 
                path="/tv" 
                element={
                  <TVShows 
                    addToWatchlist={addToWatchlist}
                    isInWatchlist={isInWatchlist}
                  />
                } 
              />
              <Route 
                path="/tv/:id" 
                element={
                  <TVShowDetails 
                    addToWatchlist={addToWatchlist}
                    isInWatchlist={isInWatchlist}
                  />
                } 
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}

export default App;
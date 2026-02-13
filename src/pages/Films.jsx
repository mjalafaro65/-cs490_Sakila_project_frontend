import { useState, useEffect } from 'react';
import axios from 'axios';

function Film() {

  const [searchData, setSearchData] = useState({
    query: '', genre: '', actor: ''
  });
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!searchData.query && !searchData.genre && !searchData.actor) {
        setMovies([]);
        return;
      }
      
      setLoading(true);
      try {
        const { data } = await axios.get('/api/search', {
          params: searchData 
        });
        setMovies(data);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchMovies, 300);
    return () => clearTimeout(timeoutId);
  }, [searchData]);

  const handleChange = (field) => (e) => {
    setSearchData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <div className="films-page">
      <h1>Films</h1>
      {/*insert table of all films here */}
      
      <div className="search-filters">
        <input
          placeholder="Film title/keywords"
          value={searchData.query}
          onChange={handleChange('query')}
        />
        <input
          placeholder="Genre (Action, Drama...)"
          value={searchData.genre}
          onChange={handleChange('genre')}
        />
        <input
          placeholder="Actor name"
          value={searchData.actor}
          onChange={handleChange('actor')}
        />
      </div>
      
      {loading && <p>Searching...</p>}
      
      <div className="movies-grid">
        {movies.map(movie => (
          <div key={movie.id} className="movie-card">
            <h3>{movie.title}</h3>
            <p><strong>Genre:</strong> {movie.genre}</p>
            <p>{movie.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Film;

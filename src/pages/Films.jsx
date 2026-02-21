import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

function Films() {

  const [searchType, setSearchType] = useState("title");
  const [query, setQuery] = useState("");
  const [films, setFilms]= useState([]);
  const [selectedFilm, setSelectedFilm]= useState(null);
  const [error, setError]= useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
  if (query) {
    fetchFilms();
  }
}, [page]);


 const fetchFilms = async (e) => {
    if (e) e.preventDefault();
    try {
      setError("");

      const response = await axios.get(
        "http://127.0.0.1:5000/films/search",
        {
          params: {
            s: query.trim(),
            by: searchType, 
            page: page, 
            per_page: perPage
          }
        }
      );

      const data = response.data;
      /*console.log("Backend returned:", data); -- for testing*/
      setFilms(data.items);
      setTotalPages(data.pages);

      console.log("Backend returned:", response.data);

      if (data.items.length == 0){
        setError("No films found.");
        setTotalPages(0);
      }
  } catch (err){
    console.error("Search failed:", err);
    setError("No films found.");
    setFilms([]);
   }
  };

  const fetchFilmDetails = async (id) => {
    try {
      const { data } = await axios.get(
        `http://127.0.0.1:5000/films/${id}`
      );
      setSelectedFilm(data);
    } catch (err) {
      console.error("Failed to fetch film details:", err);
    }
  };

  const formatName = (name) =>
  name.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div>
      <h2>Search Films</h2>
      <form onSubmit={fetchFilms}>
         <select 
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        className="search-dropdown"
      >
        <option value="title">Title</option>
        <option value="actor">Actor</option>
        <option value="genre">Genre</option>
      </select>

      <input className="searchbar"
        type="text"
        placeholder={`Search by ${searchType}`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
        <button type="submit">Search</button>

      </form>
      

      {error && <p style={{ color: "red" }}>{error}</p>}


      {films.length > 0 && (
        <table className="tables">
          <thead>
            <tr>
              <th>Title</th>
              <th>Release Year</th>
              <th>Genre</th>
            </tr>
          </thead>
          <tbody>
            {films.map((film) => (
              <tr
                key={film.film_id}
                onClick={() => fetchFilmDetails(film.film_id)}
                style={{ cursor: "pointer" }}
              >
                <td>{formatName(film.title)}</td>
                <td>{film.release_year}</td>
                <td>{film.categories[0].name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedFilm && (
        <div className="popUp-overlay">
          <div className="popUp-card">
            <button className="close-button" onClick={() => setSelectedFilm(null)}>X</button>
          
            <h2 className="popUp-title">{formatName(selectedFilm.title)}</h2>
            <p><span className="label">Film ID:</span> {selectedFilm.film_id}</p>
            <p><span className="label">Description:</span> {selectedFilm.description}</p>
            <p><span className="label">Release Year:</span> {selectedFilm.release_year}</p>
            <p><span className="label">Rental Duration:</span> {selectedFilm.rental_duration}</p>
            <p><span className="label">Rental Rate:</span> {selectedFilm.rental_rate}</p>
            <p><span className="label">Length:</span> {selectedFilm.length}</p>
            <p><span className="label">Replacement Cost:</span> {selectedFilm.replacement_cost}</p>
         
          </div>
        </div>
      )}
    <div className="films-button">
      <button 
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <span> Page {films.length === 0 ? 0: page} of {totalPages} </span>

        <button
          disabled={page === totalPages || films.length === 0}
          onClick={() => setPage(page + 1)}
        >
          Next
      </button>
      </div>
    </div>
  );
}

export default Films;

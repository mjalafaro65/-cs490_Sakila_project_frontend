import { useState } from "react";
import axios from "axios";
import "../App.css";

function Films() {
  const [searchData, setSearchData] = useState({
    query: "",
    genre: "",
    actor: ""
  });

  const [films, setFilms]= useState([]);
  const [selectedFilm, setSelectedFilm]= useState(null);
  const [error, setError]= useState("");

  const handleChange= (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

 const fetchFilms= async () => {
    try {
      setError("");
      const response = await axios.get(
        "http://127.0.0.1:5000/films/search",
        {
          params: {
            s:
              searchData.query ||
              searchData.genre ||
              searchData.actor,
            by: searchData.genre
              ? "genre"
              : searchData.actor
              ? "actor"
              : "title"}
        }
      );

      const data = response.data;
      /*console.log("Backend returned:", data); -- for testing*/

      if (Array.isArray(data)) {
        if (data.length === 0){
          setError("No films found.");
        }
      setFilms(data);
    } else {
      console.error("Unexpected format:", data);
      setFilms([]);
    }

      setFilms(data);
    } catch (err) {
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

      <input className="searchbar"
        type="text"
        name="query"
        placeholder="Search by title"
        value={searchData.query}
        onChange={handleChange}
      />

      <input className="searchbar"
        type="text"
        name="actor"
        placeholder="Search by actor"
        value={searchData.actor}
        onChange={handleChange}
      />

      <input className="searchbar"
        type="text"
        name="genre"
        placeholder="Search by genre"
        value={searchData.genre}
        onChange={handleChange}
      />

      <button onClick={fetchFilms}>Search</button>

      {error && <p style={{ color: "red" }}>{error}</p>}


      {films.length > 0 && (
        <table className="tables">
          <thead>
            <tr>
              <th>Title</th>
              <th>Release Year</th>
              <th>Rating</th>
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
                <td>{film.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedFilm && (
        <div className="popUp-overlay">
          <div className="popUp-card">
            <button className="close-button" onClick={() => setSelectedFilm(false)}>X</button>
          
            <h2 className="popUp-title">{formatName(selectedFilm.title)}</h2>
            <p><span className="label">Description:</span> {selectedFilm.description}</p>
            <p><span className="label">Length:</span> {selectedFilm.length}</p>
            <p><span className="label">Rating:</span> {selectedFilm.rating}</p>
          </div>
        </div>

      )}
    </div>
  );
}

export default Films;

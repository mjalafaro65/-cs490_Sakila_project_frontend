import { useState } from "react";
import axios from "axios";

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

  return (
    <div>
      <h2>Search Films</h2>

      {/* search bar */}
      <input
        type="text"
        name="query"
        placeholder="Search by title"
        value={searchData.query}
        onChange={handleChange}
      />

      <input
        type="text"
        name="actor"
        placeholder="Search by actor"
        value={searchData.actor}
        onChange={handleChange}
      />

      <input
        type="text"
        name="genre"
        placeholder="Search by genre"
        value={searchData.genre}
        onChange={handleChange}
      />

      <button onClick={fetchFilms}>Search</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* the returned table */}
      {films.length > 0 && (
        <table border="1" cellPadding="5">
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
                <td>{film.title}</td>
                <td>{film.release_year}</td>
                <td>{film.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* for the pop-up */}
      {selectedFilm && (
        <div
          style={{
            position: "fixed",
            top: "20%",
            left: "30%",
            background: "white",
            padding: "20px",
            border: "1px solid black"
          }}
        >
          <h3>{selectedFilm.title}</h3>
          <p><strong>Description:</strong> {selectedFilm.description}</p>
          <p><strong>Length:</strong> {selectedFilm.length} min</p>
          <p><strong>Rating:</strong> {selectedFilm.rating}</p>

          <button onClick={() => setSelectedFilm(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default Films;

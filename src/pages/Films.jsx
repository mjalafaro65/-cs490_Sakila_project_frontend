import { useState, useEffect } from "react";
import axios from "axios";
import api from '../axios.jsx';
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
  const [rental, setRental] = useState(""); 

  const [showRentPopup, setShowRentPopup] = useState(false);
  const [customer_id, setCustomerId] = useState("");
  const [selectedFilm_id, setSelectedFilmId] = useState(null);
  const openRentPopup = (film_id) => {
  setSelectedFilmId(film_id);
  setCustomerId("");
  setShowRentPopup(true);
};

  const [confirmMessage, setConfirm] = useState("");
  const showConfirmation = (message) => {
    setConfirm(message);     
    setTimeout(() => setConfirm(""), 3000);
  };

  useEffect(() => {
  if (query) {
    fetchFilms();
  }
}, [page]);

 const fetchFilms = async (e) => {
    if (e) e.preventDefault();
    try {

      const inputVali = query.trim()

      if (!inputVali) {
        setError("Please enter a search item.");
        setFilms([]);
        setPage(0);
        setTotalPages(0);
        return;
      }

      const response = await api.get(`/films/search`,
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
      setFilms(data.items);
      setPage(1);
      setTotalPages(data.pages);


      if (data.items.length == 0){
        setError("No films found.");
        setPage(0);
        setTotalPages(0);
      }
  } catch (err){
    setError("Search failed.");
    setFilms([]);
   }
  };

  const fetchFilmDetails = async (id) => {
    try {
      const { data } = await api.get(
        `/films/${id}`
      );
      setSelectedFilm(data);
    } catch (err) {
      console.error("Failed to fetch film details:", err);
    }
  };

  const rentFilm= async (film_id, customer_id) =>{
    if (!customer_id) {
      setError("Please enter a customer ID.");
      return;
    }

    try{
      const response =await api.post(`/rentals`, {film_id: parseInt(film_id), customer_id: parseInt(customer_id)});  
      console.log("Rental created:", response.data); 
      showConfirmation("Film rented!"); 
      setShowRentPopup(false);

    } catch (error) {
    console.error("Error renting this film", error);
    if (error.response?.data?.error) {
      setError(error.response.data.error);
    } else {
      setError("Unexpected error while renting");
    }
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
        onChange={(e) => { const value = e.target.value;

          if (/^[A-Za-z\s]*$/.test(value)) {
            setQuery(value);
          } else {
            setError("Invalid input, please enter letters only.");
          }
        }}

        
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
              <th></th>
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
                <td> <button onClick={(e) => {e.stopPropagation();
                                    setSelectedFilmId(film.film_id); 
                                    setCustomerId("");
                                    setShowRentPopup(true);}} 
                    style={{ cursor: "pointer", padding: "6px 12px", 
                             borderRadius: "6px", backgroundColor: "#89023e"
                     }}>Rent</button>
                  </td>
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

      {showRentPopup && (
      <div className="popUp-overlay">
        <div className="popUp-card">
          <button className="close-button" onClick={() => setShowRentPopup(false)}>X</button>
          <h2>Rent Film</h2>
          <p>Please enter the Customer ID:</p>
          <input
            type="number"
            value={customer_id}
            onChange={(e) => setCustomerId(e.target.value)}
            placeholder="Customer ID"
          />
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              rentFilm(selectedFilm_id, customer_id);
            }}>
            Rent
          </button>
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </div>
      </div> )}
    </div>
  );
}

export default Films;

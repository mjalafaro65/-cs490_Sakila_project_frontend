import { useState, useEffect } from 'react';
import api from '../axios.jsx';
import "../App.css";


//runs first 
function Home() {
  const [films, setFilms] = useState([]);
  const [filmDetails, setFilmDetails] = useState(null);
  const [showFilmPopUp, setFilmPopUp] = useState(false);

  const [actors, setActors] = useState([]);
  const [actorDetails, setActorDetails] = useState(null);
  const [showActorPopUp, setActorPopUp] = useState(false);
  
  //doesn't run until component(whats in return) loads
  useEffect(()=>{

    const fetchedFilms= async ()=>{
      try{
        //api from axios
        //with axios no need to convert from json(done automatically)
        const response =await api.get('/films/top');//gets from api
        console.log("API reponse:", response);
        setFilms(response.data);//re-renders/changes the state/sets films    

      }catch(error){
        console.error("Error fetching films:", error)

      } 

    };
    
    //run function
    fetchedFilms();
    
  },[]);//empty array so it runs once

  useEffect(()=>{

    const fetchedActors= async ()=>{
      try{
        //api from axios
        //with axios no need to convert from json(done automatically)
        const response =await api.get('/actors/top');
        console.log("API reponse:", response);
        setActors(response.data);   

      }catch(error){
        console.error("Error fetching films:", error)

      } 

    };  
    fetchedActors();
    
  },[]);

    // for testing
    console.log("Actors array:", actors);
   
    const fetchFilmDetails = async (film_Id) => {
      try{
        const response = await api.get(`/films/${film_Id}`);
        setFilmDetails(response.data);
        setFilmPopUp(true);

        console.log("Film details:", response.data);

      } catch (error){
        console.error("Error fetching film details:", error);
      }
    }

    const fetchActorDetails = async (actor_Id) => {
      try{
        const response = await api.get(`/actors/top/${actor_Id}`);
        setActorDetails(response.data);
        setActorPopUp(true);

      } catch (error){
        console.error("Error fetching actor details:", error);
      }
    }

    const formatName = (name) =>
    name.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());



  return (
    <div>
      <h2>Home</h2>
      <h3>Top 5 Rented Movies</h3>
      <table className="tables">
        <thead>
          <tr>
            <th>No.</th>
            <th>Film ID</th>
            <th>Title</th>
            <th>Rental Count</th>
          </tr>
        </thead>
        <tbody>
          {films.map((film, index) => (
            <tr onClick={() => fetchFilmDetails(film.film_id)}
            style={{ cursor: "pointer" }}
            key={film.film_id}>
              <td>{index+1}</td>
              <td>{film.film_id}</td>
              <td>{formatName(film.title)}</td>
              <td>{film.rental_count}</td>
            </tr>
          ))}
        </tbody>
        </table>

        <h3>Top 5 Actors</h3>
      <table className="tables">
        <thead>
          <tr>
            <th>No.</th>
            <th>Actor ID</th>
            <th>First Name</th>
            <th>Last Name</th>
          </tr>
        </thead>
        <tbody>
          {actors.map((actor, index)=> (
            <tr key={actor.actor_id}
                onClick={() => fetchActorDetails(actor.actor_id)}
                style={{ cursor: "pointer" }}
                  >
              <td>{index+1}</td>
              <td>{actor.actor_id}</td>
              <td>{formatName(actor.first_name)}</td>
              <td>{formatName(actor.last_name)}</td>
            </tr>
          ))}
        </tbody>
        </table>

        {showFilmPopUp && filmDetails && (
        <div className="popUp-overlay">
          <div className="popUp-card">
            <button className="close-button" onClick={() => setFilmPopUp(false)}>X</button>
          
            <h2 className="popUp-title">{formatName(filmDetails.title)}</h2>
            <p><span className="label">Film ID:</span> {filmDetails.film_id}</p>
            <p><span className="label">Description:</span> {filmDetails.description}</p>
            <p><span className="label">Release Year:</span> {filmDetails.release_year}</p>
            <p><span className="label">Rental Duration:</span> {filmDetails.rental_duration}</p>
            <p><span className="label">Rental Rate:</span> {filmDetails.rental_rate}</p>
            <p><span className="label">Length:</span> {filmDetails.length}</p>
            <p><span className="label">Replacement Cost:</span> {filmDetails.replacement_cost}</p>
            <p><span className="label">Rating:</span> {filmDetails.rating}</p>
          </div>
        </div>
        )}

        {showActorPopUp && actorDetails && (
        <div className="popUp-overlay">
          <div className="popUp-card">
            <button className="close-button" onClick={() => setActorPopUp(false)}>X</button>
          
            <h2 className="popUp-title">Details:</h2>
            <p><span className="label">First Name:</span> {formatName(actorDetails.first_name)}</p>
            <p><span className="label">Last Name:</span> {formatName(actorDetails.last_name)}</p>
            <p><span className= "label" style={{textDecoration: "Underline"}}>Their Top 5 Movies:</span></p>
            <ol>
              {actorDetails.films && actorDetails.films.map((film) => (
              <li key={film.film_id}>
                {formatName(film.title)}
              </li>
              ))}
            </ol>
          </div>
        </div>
        )}

    </div>

  );

  


}

export default Home;

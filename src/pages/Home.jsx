import { useState, useEffect, use } from 'react';
import api from '../axios.jsx';


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
        const response = await api.get(`/actors/${actor_Id}`);
        setActorDetails(response.data);
        setActorPopUp(true);

      } catch (error){
        console.error("Error fetching actor details:", error);
      }
    }


  return (
    <div>
      <h2>Home</h2>
      <h3>Top 5 Rented Movies</h3>
      <table border="1" cellPadding="5" cellSpacing="0">
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
            <tr key={film.film_id}>
              <td>{index+1}</td>
              <td>{film.film_id}</td>
              <td>
                <button 
                  onClick={() => fetchFilmDetails(film.film_id)}
                  style={{ cursor: "pointer", background: "none", 
                  border: "none", color: "black", textDecoration: "underline"}}> 
                  {film.title}
                  </button>
                  </td>
              <td>{film.rental_count}</td>
            </tr>
          ))}
        </tbody>
        </table>

        <h3>Top 5 Actors</h3>
      <table border="1" cellPadding="5" cellSpacing="0">
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
            <tr key={actor.actor_id}>
              <td>{index+1}</td>
              <td>{actor.actor_id}</td>
              <td>
              <button 
                  onClick={() => {
                  console.log("Actor ID clicked:", actor.actor_id);
                  fetchActorDetails(actor.actor_id)
                  }}
                  style={{ cursor: "pointer", background: "none", 
                  border: "none", color: "black", textDecoration: "underline"}}> 
                  {actor.first_name}
                  </button>
              </td>
              <td>{actor.last_name}</td>
            </tr>
          ))}
        </tbody>
        </table>

        {showFilmPopUp && filmDetails && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            minWidth: "300px",
            maxWidth: "500px"
          }}>
            <h2>{filmDetails.title}</h2>
            <p><strong>Release Year:</strong> {filmDetails.release_year}</p>
            <p><strong>Description:</strong> {filmDetails.description}</p>
            <p><strong>Rating:</strong> {filmDetails.rating}</p>
            <button onClick={() => setFilmPopUp(false)}>Close</button>
          </div>
        </div>
        )}

        {showActorPopUp && actorDetails && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%", 
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            minWidth: "300px",
            maxWidth: "500px",
            maxHeight: "80vh",
            overflowY: "auto",
          }}>
            <h3>First Name: {actorDetails.first_name}</h3>
            <h3>Last Name: {actorDetails.last_name}</h3>
            <h3>Their Top 5 Movies:</h3>
            <ul>
              {actorDetails.films && actorDetails.films.map((film, index) => (
              <li key={film.film_id}>
                {index+1}.{film.title}
              </li>
              ))}
            </ul>
            <button onClick={() => setActorPopUp(false)}>Close</button>
          </div>
        </div>
        )}

    </div>

  );

  


}

export default Home;

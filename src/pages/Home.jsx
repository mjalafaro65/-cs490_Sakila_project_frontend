import { useState, useEffect } from 'react';
import api from '../axios.jsx';


//runs first 
function Home() {
  const [films, setFilms]=useState([]);
  
  
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

  return (
    <div>
      <h2>Home</h2>
      <h3>Top 5 Rented Movies</h3>
      {/*
      <ul>
        {
          //takes array stored in films and makes a list for each one, like a for loop
          films.map((film)=>(
            // needs unique key to track each item(useful for re-rendering)
            <li key={film.film_id}> 
              <strong>{film.title}</strong>- {film.rental_count}
            </li>
          ))
        }
      </ul>
      */}
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Film ID</th>
            <th>Title</th>
            <th>Rental Count</th>
          </tr>
        </thead>
        <tbody>
          {films.map(film=> (
            <tr key={film.film_id}>
              <td>{film.film_id}</td>
              <td>{film.title}</td>
              <td>{film.rental_count}</td>
            </tr>
          ))}
        </tbody>
        </table>
    </div>

  );


}

export default Home;

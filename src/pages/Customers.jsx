import { useState, useEffect } from 'react';
import api from '../axios.jsx';

function Customers() {

  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() =>{
    const fetchedCustomers= async ()=>{
      try{
        const {data} =await api.get('/customers',
        {
          params:{
            page: page, per_page: 12
          },
        } 
      );
      console.log("API response:", data);
      setCustomers(data.items);
      // setPage(data.current_page);
      setTotalPages(data.pages);

      }catch(error){
        console.error("Error fetching customers:", error)

      } 

    };
    
    fetchedCustomers();

  },[page]);

  const formatName = (name) =>
  name.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

  const formatEmail = (email) =>
  email.toLowerCase();

 
  return (
    <div>
      <h2>Customer List</h2>
      <table className="tables">
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {customers?.map((customer) => (
            <tr key={customer.customer_id}>
              <td>{customer.customer_id}</td>
              <td>{formatName(customer.first_name)} {formatName(customer.last_name)}</td>
              <td>{formatEmail(customer.email)}</td>
              <td>{customer.active ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
        </table>

     <br />

        <button 
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <span> Page {page} of {totalPages} </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
  );
}

export default Customers;

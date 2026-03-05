import { useState, useEffect } from 'react';
import api from '../axios.jsx';

function Customers() {
 
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  const [searchType, setSearchType] = useState("customer_id");
  const [query, setQuery] = useState("");

  const [error, setError] = useState("");
  const [errorPop, setPopUpError] = useState("");
  const [confirmMessage, setConfirm] = useState("");
  const showConfirmation = (message) => {
    setConfirm(message);     
    setTimeout(() => setConfirm(""), 3000);
  };

  const [customerDetails, setCustomerDetails] = useState(null);
  const [createPopup, setCreatePopup] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
      first_name: "",
      last_name: "",
      email: "",
      address: "", 
      district: "", 
      postal_code: "", 
      city: "", 
      country: "", 
      phone: "", 
      store_id: 1, 
      active: true
    });

  const [editCustomData, setEditCustomData] = useState(null);

  useEffect(() =>{
    const fetchedCustomers= async ()=>{
      try{
        setError("");
        const {data} =await api.get('/customers',
        {
          params:{
            page: page, per_page: 12
          },
        } 
      );
      setCustomers(data.items);
      // setPage(data.current_page);
      setTotalPages(data.pages);

      }catch(error){
        console.error("Error fetching customers:", error)

      } 

    };
    
    fetchedCustomers();

  },[page]);


  const returnFilmforCust = async (customer_id, film_id) => {
    try {
      await api.patch(`/customers/${customer_id}/rentals/films/${film_id}/return`);
      
      fetchCustomerDetails(customer_id);

    } catch (error) {
      console.error("Error returning film:", error);
    }
  };

  const createCustomer = async () => {
    const trimmedCustomer = {
        first_name: newCustomer.first_name?.trim(),
        last_name: newCustomer.last_name?.trim(),
        email: newCustomer.email?.trim(),
        address: newCustomer.address?.trim(),
        district: newCustomer.district.toString(),     
        postal_code: newCustomer.postal_code.toString(),
        city: newCustomer.city?.trim(),
        country: newCustomer.country?.trim(),
        phone: newCustomer.phone?.trim(),
        store_id: 1,
        active: newCustomer.active ? 1 : 0   
      };

      const requiredFields = [
        "first_name", "last_name", "email", "address", 
        "district", "postal_code", "city", "country", "phone"
      ];

      const missingField = requiredFields.find(
        field => 
          trimmedCustomer[field] === undefined || 
          trimmedCustomer[field] === "" || 
          (typeof trimmedCustomer[field] === "number" && isNaN(trimmedCustomer[field]))
      );

      if (missingField) {
        setPopUpError(`Please enter a valid ${missingField}.`);
        return;
      }

      try {
        const response = await api.post("/customers", trimmedCustomer);
        setCreatePopup(false);
        setNewCustomer({
          first_name: "",
          last_name: "",
          email: "",
          address: "",
          district: "",
          postal_code: "",
          city: "",
          country: "",
          phone: "",
          store_id: 1,
          active: true
        });
        showConfirmation("New customer successfully created!");
        setPopUpError("");
        setPage(1);
      } catch (error) {
        console.error("Error creating customer:", error);
        setPopUpError(error.response?.data?.message || "Failed to create new customer");
      }
    };

    // function to delete customer 
    const deleteCustomer = async (customer_id) => {
      try {
        await api.delete(`/customers/${customer_id}`);
        
        setCustomers(customers.filter(c => c.customer_id !== customer_id));

        if (customerDetails?.customer_id === customer_id) setCustomerDetails(null);

        showConfirmation("Customer deleted successfully!");
      } catch (error) {
        console.error("Error deleting customer:", error);
        setPopUpError(error.response?.data?.message || "Failed to delete customer");
      }
    }

    // function to edit the customer
    const saveEditedCustomer = async (customer_id) => {
      if (!editCustomData) return;

      const payload = {
        first_name: editCustomData.first_name?.trim() || "",
        last_name: editCustomData.last_name?.trim() || "",
        email: editCustomData.email?.trim() || "",
        store_id: editCustomData.store_id,
        active: editCustomData.active ? 1 : 0,
        address: editCustomData.address?.address?.trim() || "",
        address2: editCustomData.address?.address2?.trim() || "",
        district: editCustomData.address?.district?.trim() || "",
        postal_code: editCustomData.address?.postal_code?.trim() || "",
        city: editCustomData.address?.city?.trim() || "",        
        country: editCustomData.address?.country?.trim() || "", 
        phone: editCustomData.address?.phone?.trim() || ""
      };

      console.log(payload);

    try {
      const response = await api.put(`/customers/${customer_id}`, payload, {
        headers: { "Content-Type": "application/json" }
      });

      setCustomers(customers.map(c => c.customer_id === customer_id ? response.data : c));
      setEditCustomData(null);
      showConfirmation("Customer updated successfully!");
    } catch (error) {
      console.error("Error editing customer:", error);
      setPopUpError(error.response?.data?.message || "Failed to update customer");
    }
  };
  
  const fetchCustomer = async (e) => {
    if (e) e.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setError("Please enter a search item.");
      setCustomers([]);
      setPage(0);
      setTotalPages(0);
      return;
    }

    try {
      setError("");

      const response = await api.get(`/customers`,
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
      setCustomers(data.items);
      setPage(1);
      setTotalPages(data.pages);

      if (data.items.length == 0){
        setError("No customer found.");
        setPage(0);
        setTotalPages(0);
      }
  } catch (err){
    console.error("Search failed:", err);
    setError("No customer found.");
    setCustomers([]);
   }
  };

  const fetchCustomerDetails = async (customer_id) => {
    const { data } = await api.get(`/customers/${customer_id}`);
    setCustomerDetails({
      ...data,
      city: data.city || data.address?.city || "-"
    });
  };

  const formatName = (name) =>
  name.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

  const formatEmail = (email) =>
  email.toLowerCase();
 
  return (
    <div>

      <h2>Search Customers</h2>
      <form onSubmit={fetchCustomer}>
         <select 
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        className="search-dropdown"
      >
        <option value="customer_id">Customer ID</option>
        <option value="first_name">First Name</option> 
        <option value="last_name">Last Name</option>
      </select>

      <input className="searchbar"
        type="text"
        placeholder={`Search by ${searchType}`}
        value={query}
        onChange={(e) =>{const value = e.target.value;
        if (/^[A-Za-z0-9\s]*$/.test(value)) {
          setQuery(value);
          setError(""); 
        } else {
          setError("Invalid input, please enter letters and/or numbers only.");
        }
        }}
      />
        <button type="submit">Search</button>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        {confirmMessage && <p style={{ color: "green", marginTop: "10px" }}>{confirmMessage}</p>}
      </form>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Customer List</h2>
          <button 
            className="create-button"
            onClick={() => setCreatePopup(true)}
          >
            + Create Customer
          </button>
      </div>

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
            <tr key={customer.customer_id} 
                onClick={() => fetchCustomerDetails(customer.customer_id)}
                style={{ cursor: "pointer" }}
            >
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

        <span> Page {page === 0 ? 0: page} of {totalPages} </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>

        {customerDetails && (
        <div className="popUp-overlay">
          <div className="popUp-card" style={{
              width: "600px",
              maxWidth: "90%", 
              height: "auto",  
              padding: "20px",
            }}> 
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", marginRight: "50px" }}>
            <h2 className="popUp-title">{formatName(customerDetails.first_name)} {formatName(customerDetails.last_name)}</h2>
            <div style={{ display: "flex", gap: "10px"  }}>
              <button className = "edit" onClick={() => {setEditCustomData(customerDetails);
                                                        setCustomerDetails(null);}}>Edit</button>
              <button className = "delete" onClick={() => deleteCustomer(customerDetails.customer_id)}>Delete</button>
              <button className="close-button" onClick={() => setCustomerDetails(null)}>X</button>
            </div>
            </div>
            <p><span className="label">Customer ID:</span> {customerDetails.customer_id}</p>
            <p><span className="label">Store ID:</span> {customerDetails.store_id}</p>
            <p><span className="label">Email:</span> {formatEmail(customerDetails.email)}</p>
            <p><span className="label">Address:</span> {customerDetails.address?.address || "-"}</p>
            <p><span className="label">Address 2:</span> {customerDetails.address?.address2 || "-"}</p>
            <p><span className="label">District:</span> {customerDetails.address?.district || "-"}</p>
            <p><span className="label">City:</span> {customerDetails.city || "-"}</p>
            <p><span className="label">Country:</span> {customerDetails.address?.city_country?.country?.country || "-"}</p>
            <p><span className="label">Postal Code:</span> {customerDetails.address?.postal_code || "-"}</p>
            <p><span className="label">Phone:</span> {customerDetails.address?.phone || "-"}</p>
            <p><span className="label">Active:</span> {customerDetails.active ? "Yes" : "No"}</p>
            <p><span className="label">Number of Films Returned:</span> {customerDetails.returned_count}</p>
            <p><span className="label">Number of Currently Borrowed Films:</span> {customerDetails.active_count}</p>
            <p><span className="label" style={{ textDecoration: "underline" }}>Rental Record:</span> </p> 
              <table className="tables" >
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Film</th>
                    <th  style={{ textAlign: "center" }}>Returned</th>
                    <th  style={{ textAlign: "center" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {customerDetails?.rentals?.length > 0 ? (
                    customerDetails.rentals.map((rental) => (
                      <tr key={rental.rental_id} 
                          onClick={() => fetchCustomerDetails(rental.customer_id)}
                          style={{ cursor: "pointer" }}
                      >
                        <td>{formatName(rental.film_title)}</td>
                        <td style={{ textAlign: "center" }}>{rental.returned ? "Yes" : "No"}</td>
                        <td style={{ textAlign: "center" }}>
                          {!rental.returned && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                returnFilmforCust(customerDetails.customer_id, rental.film_id);}}
                            >
                              Mark as Returned
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>N/A</td>
                      <td>N/A</td>
                    </tr>
                  )}
                </tbody>
              </table>
          </div>
        </div>
      )}

      {editCustomData && (
      <div className="popUp-overlay">
        <div className="popUp-card">
          <button className="close-button" onClick={() => setEditCustomData(null)}>X</button>
          <h2>Edit Customer</h2>

          <input
            type="text"
            placeholder="First Name"
            value={editCustomData.first_name}
            onChange={(e) => setEditCustomData({ ...editCustomData, first_name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={editCustomData.last_name}
            onChange={(e) => setEditCustomData({ ...editCustomData, last_name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={editCustomData.email}
            onChange={(e) => setEditCustomData({ ...editCustomData, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Address"
            value={editCustomData.address?.address}
            onChange={(e) => setEditCustomData({...editCustomData, address: {...editCustomData.address, address: e.target.value}})}
          />
          <input
            type="text"
            placeholder="District"
            value={editCustomData.address?.district}
            onChange={(e) => setEditCustomData({...editCustomData, address: {...editCustomData.address, district: e.target.value}})}
          />
          <input
            type="number"
            placeholder="Postal Code"
            value={editCustomData.address?.postal_code}
            onChange={(e) => setEditCustomData({...editCustomData, address: {...editCustomData.address, postal_code: e.target.value}})}
          />
          <input
            type="text"
            placeholder="City"
            value={editCustomData.city || ""}
            onChange={(e) => setEditCustomData({...editCustomData, address: {...editCustomData.address, city: e.target.value}})}
          />
          <input
            type="text"
            placeholder="Country"
            value={editCustomData.address?.city_country?.country?.country || ""}
            onChange={(e) => setEditCustomData({...editCustomData, address: {...editCustomData.address, country: e.target.value}})}
          />
          <input
            type="text"
            placeholder="Phone"
            value={editCustomData.address?.phone}
            onChange={(e) => setEditCustomData({...editCustomData, address: {...editCustomData.address, phone: e.target.value}})}
          />
          <label>
            Active: 
            <input
              type="checkbox"
              checked={editCustomData.active}
              onChange={(e) => setEditCustomData({ ...editCustomData, active: e.target.checked })}
            />
          </label>

          <button onClick={() => saveEditedCustomer(editCustomData.customer_id)}>Save Changes</button>
        </div>
      </div>
    )}

      {createPopup && (
      <div className="popUp-overlay">
        <div className="popUp-card">
          <button 
            className="close-button"
            onClick={() => setCreatePopup(false)}
          >
            X
          </button>

          <h2>Create New Customer</h2>

          <input
            type="text"
            placeholder="First Name"
            value={newCustomer.first_name}
            onChange={(e) =>{const value = e.target.value;
              if (/^[A-Za-z\s]*$/.test(value)) {
                setNewCustomer({ ...newCustomer, first_name: value })
                setPopUpError(""); 
              } else {
                setPopUpError("Invalid input, please enter letters only.");
              }
            }}
          />

          <input
            type="text"
            placeholder="Last Name"
            value={newCustomer.last_name}
            onChange={(e) =>{const value = e.target.value;
              if (/^[A-Za-z\s]*$/.test(value)) {
                setNewCustomer({ ...newCustomer, last_name: value })
                setPopUpError(""); 
              } else {
                setPopUpError("Invalid input, please enter letters only.");
              }
            }}
          />

          <input
            type="email"
            placeholder="Email"
            value={newCustomer.email}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, email: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Address"
            value={newCustomer.address}
            onChange={(e) =>{const value = e.target.value;
              if (/^[A-Za-z0-9-\s]*$/.test(value)) {
                setNewCustomer({ ...newCustomer, address: value })
                setPopUpError(""); 
              } else {
                setPopUpError("Invalid input, please enter letters and numbers only.");
              }
            }}
          />

          <input
            type="text"
            placeholder="District"
            value={newCustomer.district}
            onChange={(e) =>{const value = e.target.value;
              if (/^[A-Za-z0-9]*$/.test(value)) {
                setNewCustomer({ ...newCustomer, district: value })
                setPopUpError(""); 
              } else {
                setPopUpError("Invalid input, please enter numbers only.");
              }
            }}
          />

          <input
            type="text"
            placeholder="Postal Code"
            value={newCustomer.postal_code}
            onChange={(e) =>{const value = e.target.value;
              if (/^[0-9]*$/.test(value)) {
                setNewCustomer({ ...newCustomer, postal_code: value })
                setPopUpError(""); 
              } else {
                setPopUpError("Invalid input, please enter numbers only.");
              }
            }}
          />
          
          <input
            type="text"
            placeholder="City"
            value={newCustomer.city}
            onChange={(e) =>{const value = e.target.value;
              if (/^[A-Za-z\s]*$/.test(value)) {
                setNewCustomer({ ...newCustomer, city: value })
                setPopUpError(""); 
              } else {
                setPopUpError("Invalid input, please enter letters only.");
              }
            }}
          />

          <input
            type="text"
            placeholder="Country"
            value={newCustomer.country}
            onChange={(e) =>{const value = e.target.value;
              if (/^[A-Za-z\s]*$/.test(value)) {
                setNewCustomer({ ...newCustomer, country: value })
                setPopUpError(""); 
              } else {
                setPopUpError("Invalid input, please enter letters only.");
              }
            }}
          />

          <input
            type="tel"
            placeholder="Phone"
            value={newCustomer.phone}
            onChange={(e) =>{const value = e.target.value;
              if (/^[0-9-\s]*$/.test(value)) {
                setNewCustomer({ ...newCustomer, phone: value })
                setPopUpError(""); 
              } else {
                setPopUpError("Invalid input, please enter numbers only.");
              }
            }}
          />

          {errorPop && <p style={{ color: "red", marginTop: "10px" }}>{errorPop}</p>}

          <button onClick={createCustomer}>Submit</button>
        </div>
      </div>
      )}
    </div>

      
  );
}

export default Customers;

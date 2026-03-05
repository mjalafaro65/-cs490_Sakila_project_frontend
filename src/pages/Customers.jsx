import { useState, useEffect } from 'react';
import api from '../axios.jsx';

function Customers() {
 
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  const [searchType, setSearchType] = useState("customer_id");
  const [query, setQuery] = useState("");

  const [showReturnPopup, setReturnPopup] = useState(false);
  const [film_id, setFilmId] = useState("");
  const [selectedCustId, setSelectedCustId] = useState(null);
  const openRentPopup = (customer_id) => {
  setSelectedCustId(customer_id);
  setFilmId("");
  showReturnPopup(true);
};

  const [error, setError] = useState("");
  const [errorPop, setPopUpError] = useState("");
  const [errorPop2, setPopUp2Error] = useState(""); //make these errors work???
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
  console.log(`Attempting to return film. customer_id=${customer_id}, film_id=${film_id}`);

  try {
    const response = await api.patch(`/customers/${customer_id}/rentals/films/${film_id}/return`);
    console.log(response.data); 
    showConfirmation("Film returned successfully!");
    fetchCustomerDetails(customer_id);
    setReturnPopup(false);
  } catch (err) {
    setError(`Failed to return film: ${serverMessage}`);
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
        address: editCustomData.address?.trim() || "",
        address2: editCustomData.address2?.trim() || "",
        district: editCustomData.district?.trim() || "",
        postal_code: editCustomData.postal_code?.trim() || "",
        city: editCustomData.city?.trim() || "",        
        country: editCustomData.country?.trim() || "", 
        phone: editCustomData.phone?.trim() || ""
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
      setPopUpError("Failed to update customer, please check all fields");
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
    if (!customer_id) return; 

    try {
        const { data } = await api.get(`/customers/${customer_id}`);
        setCustomerDetails(data);
        console.log("Fetching customer", customer_id);
        console.log(data);
    } catch (err) {
        console.error("Failed to fetch customer details:", err);
        setError("Failed to fetch customer details.");
    }
  }
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
            <div style={{ display: "flex", gap: "3px"  }}>
              <button className = "edit" onClick={() => {setEditCustomData(customerDetails);
                                                        setCustomerDetails(null);}}>Edit</button>
              <button className = "delete" onClick={() => deleteCustomer(customerDetails.customer_id)}>Delete</button>
              <button className = "returnFilm" onClick={(e) => {e.stopPropagation();
                                                                setSelectedCustId(customerDetails.customer_id); 
                                                                setFilmId("");
                                                                setReturnPopup(true);}}>Return Film</button>
              <button className="close-button" onClick={() => setCustomerDetails(null)}>X</button>
            </div>
            </div>

            {confirmMessage && <p style={{ color: "green", marginTop: "10px" }}>{confirmMessage}</p>}

            <p><span className="label">Customer ID:</span> {customerDetails.customer_id}</p>
            <p><span className="label">Store ID:</span> {customerDetails.store_id}</p>
            <p><span className="label">Email:</span> {formatEmail(customerDetails.email)}</p>
            <p><span className="label">Address:</span> {customerDetails.address || "-"}</p>
            <p><span className="label">Address 2:</span> {customerDetails.address2 || "-"}</p>
            <p><span className="label">District:</span> {customerDetails.district || "-"}</p>
            <p><span className="label">City:</span> {customerDetails.city || "-"}</p>
            <p><span className="label">Country:</span> {customerDetails.country || "-"}</p>
            <p><span className="label">Postal Code:</span> {customerDetails.postal_code || "-"}</p>
            <p><span className="label">Phone:</span> {customerDetails.phone || "-"}</p>
            <p><span className="label">Active:</span> {customerDetails.active ? "Yes" : "No"}</p>
            <p><span className="label">Number of Films Returned:</span> {customerDetails.returned_count}</p>
            <p><span className="label">Number of Currently Borrowed Films:</span> {customerDetails.active_count}</p>
            <p><span className="label" style={{ textDecoration: "underline" }}>Rental Record:</span> </p> 
              <table className="tables" >
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>Film ID</th>
                    <th style={{ textAlign: "center" }}>Film</th>
                    <th  style={{ textAlign: "center" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customerDetails?.rented_films?.length > 0 ? (
                    customerDetails.rented_films.map((rental) => (
                      <tr key={rental.rental_id}>
                        <th style={{ textAlign: "center" }}>{rental.film_id}</th>
                        <td style={{ textAlign: "center" }}>{formatName(rental.title)}</td>
                        <td style={{ textAlign: "center" }}>{rental.status === "Returned" ? "Returned" : "Active"}</td>
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
        <div className="popUp-card form-container">
          <button className="close-button" onClick={() => setEditCustomData(null)}>X</button>
          <h2>Edit Customer</h2>

          <div className="form-row">
          <input
            type="text"
            placeholder="First Name"
            value={formatName(editCustomData.first_name)}
            onChange={(e) => {const value = e.target.value;
                      if (/^[A-Za-z\s]*$/.test(value)) {
                            setEditCustomData({ ...editCustomData, first_name: e.target.value })
                            setPopUpError(""); 
                          } else {
                            setPopUpError("Invalid input, please enter letters only.");
                  }}}
          />
          </div>
          <div className="form-row">
          <input
            type="text"
            placeholder="Last Name"
            value={formatName(editCustomData.last_name)}
            onChange={(e) => {const value = e.target.value;
                      if (/^[A-Za-z\s]*$/.test(value)) {
                            setEditCustomData({ ...editCustomData, last_name: e.target.value })
                            setPopUpError(""); 
                          } else {
                            setPopUpError("Invalid input, please enter letters only.");
                  }}}
          />
          </div>
          <div className="form-row">
          <input
            type="email"
            placeholder="Email"
            value={formatEmail(editCustomData.email)}
            onChange={(e) => setEditCustomData({ ...editCustomData, email: e.target.value })}
          /></div>
          <div className="form-row">
          <input
            type="text"
            placeholder="Address"
            value={editCustomData.address}
            onChange={(e) => {const value = e.target.value;
                      if (/^[A-Za-z0-9-\s]*$/.test(value)) {
                            setEditCustomData({...editCustomData, address: e.target.value})
                            setPopUpError(""); 
                          } else {
                            setPopUpError("Invalid input, please enter letters and numbers only.");
                  }}}
          /></div>
          <div className="form-row">
          <input
            type="text"
            placeholder="Address 2"
            value={editCustomData.address2}
            onChange={(e) => {const value = e.target.value;
                      if (/^[A-Za-z0-9-\s]*$/.test(value)) {
                            setEditCustomData({...editCustomData, address2: e.target.value})
                            setPopUpError(""); 
                          } else {
                            setPopUpError("Invalid input, please enter letters and numbers only.");
                  }}}
          /></div>
          <div className="form-row">
          <input
            type="text"
            placeholder="District"
            value={editCustomData.district}
            onChange={(e) => {const value = e.target.value;
                      if (/^[A-Za-z0-9-\s]*$/.test(value)) {
                            setEditCustomData({...editCustomData, district: e.target.value})
                            setPopUpError(""); 
                          } else {
                            setPopUpError("Invalid input, please enter letters and numbers only.");
                  }}}
          />
          </div>
          <div className="form-row">
          <input
            type="number"
            placeholder="Postal Code"
            value={editCustomData.postal_code}
            onChange={(e) => {const value = e.target.value;
                      if (/^[A-Za-z0-9-\s]*$/.test(value)) {
                            setEditCustomData({...editCustomData, postal_code: e.target.value})
                            setPopUpError(""); 
                          } else {
                            setPopUpError("Invalid input, please enter letters and numbers only.");
                  }}}
          />
          </div>
          <div className="form-row">
          <input
            type="text"
            placeholder="City"
            value={editCustomData.city || ""}
            onChange={(e) => {const value = e.target.value;
                      if (/^[A-Za-z\s]*$/.test(value)) {
                            setEditCustomData({ ...editCustomData, city: e.target.value})
                            setPopUpError(""); 
                          } else {
                            setPopUpError("Invalid input, please enter letters only.");
                  }}}
          />
          </div>
          <div className="form-row">
          <input
            type="text"
            placeholder="Country"
            value={editCustomData.country || ""}
            onChange={(e) => {const value = e.target.value;
                      if (/^[A-Za-z-\s]*$/.test(value)) {
                            setEditCustomData({...editCustomData, country: e.target.value})
                            setPopUpError(""); 
                          } else {
                            setPopUpError("Invalid input, please enter letters only.");
                  }}}
          />
          </div>
          <div className="form-row">
          <input
            type="text"
            placeholder="Phone"
            value={editCustomData.phone}
            onChange={(e) => {const value = e.target.value;
                      if (/^[0-9-\s]*$/.test(value)) {
                            setEditCustomData({...editCustomData, phone: e.target.value})
                            setPopUpError(""); 
                          } else {
                            setPopUpError("Invalid input, please enter numbers only.");
                  }}}
          />
          </div>
          <div className="form-row">
          <label>
            Active: 
            <input
              type="checkbox"
              checked={editCustomData.active}
              onChange={(e) => setEditCustomData({ ...editCustomData, active: e.target.checked })}
            />
          </label>

          {errorPop && <p style={{ color: "red", marginTop: "10px" }}>{errorPop}</p>}
           </div>

          <button onClick={() => saveEditedCustomer(editCustomData.customer_id)}>Save Changes</button>
        </div>
      </div>
    )}

      {createPopup && (
      <div className="popUp-overlay">
        <div className="popUp-card form-container">
          <button 
            className="close-button"
            onClick={() => setCreatePopup(false)}
          >
            X
          </button>

          <h2>Create New Customer</h2>

           {errorPop2 && <p style={{ color: "red", marginTop: "10px" }}>{errorPop2}</p>}

          <div className="form-row">
          <input
            type="text"
            placeholder="First Name"
            value={newCustomer.first_name}
            onChange={(e) =>{const value = e.target.value;
              if (/^[A-Za-z\s-]*$/.test(value)) {
                setNewCustomer({ ...newCustomer, first_name: value })
                setPopUp2Error(""); 
              } else {
                setPopUp2Error("Invalid input, please enter letters only.");
              }
            }}
          />
          </div>

          <div className="form-row">
          <input
            type="text"
            placeholder="Last Name"
            value={newCustomer.last_name}
            onChange={(e) =>{const value = e.target.value;
              if (/^[A-Za-z\s-]*$/.test(value)) {
                setNewCustomer({ ...newCustomer, last_name: value })
                setPopUp2Error(""); 
              } else {
                setPopUp2Error("Invalid input, please enter letters only.");
              }
            }}
          />
          </div>
          
          <div className="form-row">
          <input
            type="email"
            placeholder="Email"
            value={newCustomer.email}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, email: e.target.value })
            }
          />
          </div>

          <div className="form-row">
          <input
            type="text"
            placeholder="Address"
            value={newCustomer.address}
            onChange={(e) =>{const value = e.target.value;
              if (/^[A-Za-z0-9,\s-]*$/.test(value)) {
                setNewCustomer({ ...newCustomer, address: value })
                setPopUp2Error(""); 
              } else {
                setPopUp2Error("Invalid input, please enter letters and numbers only.");
              }
            }}
          />
          </div>

          <div className="form-row">
          <input
            type="text"
            placeholder="District"
            value={newCustomer.district}
            onChange={(e) =>{const value = e.target.value;
              if (/^[A-Za-z0-9,\s-]*$/.test(value)) {
                setNewCustomer({ ...newCustomer, district: value })
                setPopUp2Error(""); 
              } else {
                setPopUp2Error("Invalid input, please enter numbers only.");
              }
            }}
          />
          </div>

          <div className="form-row">
          <input
            type="text"
            placeholder="Postal Code"
            value={newCustomer.postal_code}
            onChange={(e) =>{const value = e.target.value;
              if (/^[0-9\s]*$/.test(value)) {
                setNewCustomer({ ...newCustomer, postal_code: value })
                setPopUp2Error(""); 
              } else {
                setPopUp2Error("Invalid input, please enter numbers only.");
              }
            }}
          />
          </div>
          
          <div className="form-row">
          <input
            type="text"
            placeholder="City"
            value={newCustomer.city}
            onChange={(e) =>{const value = e.target.value;
              if (/^[A-Za-z,\s-]*$/.test(value)) {
                setNewCustomer({ ...newCustomer, city: value })
                setPopUp2Error(""); 
              } else {
                setPopUp2Error("Invalid input, please enter letters only.");
              }
            }}
          />
          </div>

          <div className="form-row">
          <input
            type="text"
            placeholder="Country"
            value={newCustomer.country}
            onChange={(e) =>{const value = e.target.value;
              if (/^[A-Za-z,\s-]*$/.test(value)) {
                setNewCustomer({ ...newCustomer, country: value })
                setPopUp2Error(""); 
              } else {
                setPopUp2Error("Invalid input, please enter letters only.");
              }
            }}
          />
          </div>

        <div className="form-row">
          <input
            type="text"
            placeholder="Phone"
            value={newCustomer.phone}
            onChange={(e) =>{const value = e.target.value;
              if (/^[0-9\s-]*$/.test(value)) {
                setNewCustomer({ ...newCustomer, phone: value })
                setPopUp2Error(""); 
              } else {
                setPopUp2Error("Invalid input, please enter numbers only.");
              }
            }}
          />
        </div>

          <button onClick={createCustomer}>Submit</button>
        </div>
      </div>
      )}

      {showReturnPopup && (
      <div className="popUp-overlay">
        <div className="popUp-card">
          <button className="close-button" onClick={() => setReturnPopup(false)}>X</button>
          <h2>Return Film</h2>
          <p>Please enter film ID:</p>
          <input
            type="number"
            value={film_id}
            onChange={(e) => setFilmId(e.target.value)}
            placeholder="Film Id"
          />
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              returnFilmforCust(selectedCustId, film_id);
            }}>
            Return Film
          </button>
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </div>
      </div> )}

    </div>

      
  );
}

export default Customers;

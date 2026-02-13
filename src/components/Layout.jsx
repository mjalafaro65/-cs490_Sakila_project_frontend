import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

function Layout() {

 /*
  const [currentTime, setCurrentTime] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch("/api/time")
      .then((res) => res.json())
      .then((data) => {
        setCurrentTime(data.time);
      });
  }, []);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((data) => {
        setRows(data);
      });
  }, []);
*/
  return (
    <div>
      <header style={{ padding: "20px", backgroundColor: "#266293b1", color: "white" }}>
        <h1>Sakila Database Store</h1>
        <nav style={{ marginTop: "10px" }}>
          <Link to="/" style={{ color: "white", marginRight: "10px" }}>Home</Link>
          <Link to="/films" style={{ color: "white", marginRight: "10px" }}>Films</Link>
          <Link to="/customers" style={{ color: "white" }}>Customers</Link>
        </nav>
      </header>

      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>

    {/*
        <table className="movie-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>{row.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
        */}
    </div>
  );
}

export default Layout;

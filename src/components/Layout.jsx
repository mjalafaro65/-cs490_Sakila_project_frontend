import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

function Layout() {

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
    </div>
  );
}

export default Layout;

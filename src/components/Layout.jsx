import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

function Layout() {

  return (
    <div>
      <header style={{ padding: "30px", backgroundColor: "#075d29bd", color: "white" }}>
        <h1>SAKILA FILMS SHOP</h1>
        <nav style={{ marginTop: "30px", display: "flex", justifyContent: "center", gap: "150px", flexWrap: "wrap"}}>
          <Link to="/" style={{ color: "#000000", border: "1px", padding: "7px 14px", borderRadius: "6px", backgroundColor: "#f0f0f0", size: "16px" }}>Home</Link>
          <Link to="/films" style={{  color: "#000000", border: "1px", padding: "7px 14px", borderRadius: "6px", backgroundColor: "#f0f0f0", size: "16px" }}>Films</Link>
          <Link to="/customers" style={{  color: "#000000", border: "1px", padding: "7px 14px", borderRadius: "6px", backgroundColor: "#f0f0f0", size: "16px" }}>Customers</Link>
        </nav>
      </header>

      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;

import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Customers from "./pages/Customers";
import Films from "./pages/Films";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="films" element={<Films />} />
        <Route path="customers" element={<Customers />} />
      </Route>
    </Routes>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Auth/Login/Login";

function App() {
  return (
    <Routes>
      <Route path="" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;

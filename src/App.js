import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Employees from "./components/Employees";
import Vendors from "./components/Vendors";
import SendEmails from "./components/SendEmails";
import Login from "./components/Login";
import Nav from "./components/Nav";

function App() {
  const isLoggedIn = sessionStorage.getItem("loggedIn") === "true";

  return (
    <Router>
      <div>
        {isLoggedIn && <Nav />}
        <Routes>
          <Route path="/login" element={<Login />} />
          {isLoggedIn ? (
            <>
              <Route path="/employees" element={<Employees />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/send-emails" element={<SendEmails />} />
            </>
          ) : (
            <Route path="/" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

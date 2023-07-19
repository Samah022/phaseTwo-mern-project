import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <div className="box">
        <div className="header">
          <h1>Registration System</h1>
        </div>
        <h1 className="title">Welcome</h1>
        <h3 className="subtitle">Tell us WHO are you? &#128513;</h3>
        <div className="button-group">
          <Link to="/Auth">
            <button className="button ad">Admin</button>
          </Link>
          <Link to="/App">
            <button className="button use">User</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
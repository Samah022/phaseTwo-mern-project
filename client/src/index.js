import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Auth from './Auth';
import Info from './Info';
import Home from './Home';


//CSS
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter> {/* Enables client-side routing using the HTML5 history API */}
    <Routes> {/* Defines the routes for the application */}
      <Route path="/" element={<Home />} /> {/* Route for the authentication page */}
      <Route path="/Auth" element={<Auth />} /> {/* Route for the authentication page */}
      <Route path="/app" element={<App />} /> {/* Route for the user application */}
      <Route path="/info" element={<Info />} /> {/* Route for the user information page */}
    </Routes>
  </BrowserRouter>,
  document.getElementById('root') // Mounts the application to the root element in the HTML file
);
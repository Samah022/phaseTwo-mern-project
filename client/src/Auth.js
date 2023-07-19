import React from 'react';
import { useState } from 'react';
import Axios from 'axios';
import { useCookies } from 'react-cookie';
import Info from './Info';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button } from 'react-bootstrap';

const Auth = () => {
  const [cookies, setCookies] = useCookies(['access_token']); // Initialize access_token cookie
  const [registered, setRegistered] = useState(false); // State variable to keep track of whether user is registered

  /**
   * Remove access_token cookie and adminID from local storage, then reload the page
   */
  const removeCookies = () => {
    setCookies('access_token', '');
    window.localStorage.removeItem('adminID');
    window.location.reload(false);
  };

  /**
   * Set registered state variable to true to switch to Login component
   */
  const handleRegister = () => {
    setRegistered(true);
  };

  return (
    <>
      {/* Header section with navigation links */}
      <header>
        <nav>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/Auth">Admin</a>
            </li>
          </ul>
        </nav>
      </header>
      <div>
        {cookies.access_token ? (
          <>
            <Info />
            <div className="text-center">
            <Button variant="danger" onClick={removeCookies}>
              Logout
            </Button>
            </div>
          </>
        ) : (
          <>
            {registered ? <Login /> : <Register handleRegister={handleRegister} />}
          </>
        )}
      </div>
    </>
  );
};

// Component for registering a new admin user
const Register = ({ handleRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  /**
   * Handle form submission and send POST request to register new admin
   * @param e - Form submit event object
   */
  /**
 * Handle form submission and send POST request to register new admin
 * @param e - Form submit event object
 */
const onSubmit = async (e) => {
  e.preventDefault();

  // Check if admin with same username already exists
  const response = await Axios.get(`http://localhost:3001/admins/${username}`);
  if (response.data) {
    alert("Admin with that username already exists!");
    return;
  }

  // Register new admin if username is available
  await Axios.post('http://localhost:3001/register', { username, password }); 
  alert('Admin Created');
  handleRegister(); 
};
/*----------------------------------Password-------------------------------------*/
  /*
  * Validate password format
  * @param password - the password to validate
  * @returns true if the password is valid, false otherwise
  */
  const validatePassword = (password) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return re.test(String(password));
  }

  /*
  * Handle password input change and validate the password
  * @param e - Input change event object
  */
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (!validatePassword(e.target.value)) {
      e.target.setCustomValidity('Password must contain at least 8 characters, including uppercase, lowercase, and numbers');
    } else {
      e.target.setCustomValidity('');
    }
  }
/*---------------------------------------------------------------------------*/

  return (
    <Container>
      <Form className="form" onSubmit={onSubmit}>
        <h2 className="text-black">Register</h2>
        <div className="form-group">
          <Form.Control
            type="text"
            id="username"
            value={username}
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
            required
          ></Form.Control>
          <br></br>
          <Form.Control
            type="password"
            id="password"
            value={password}
            placeholder="password"
            onChange={handlePasswordChange}
            required
          ></Form.Control>
          <br></br>
          <Button variant="success" type="submit">
            Register
          </Button>
        </div>
      </Form>
    </Container>
  );
};

// Component for logging in as an admin user
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [_, setCookies] = useCookies(['access_token']); // Initialize access_token cookie

  /**
   * Handle form submission and send POST request to login as admin
   * @param e - Form submit event object
   */
  const onSubmit = async (e) => {
    e.preventDefault();
  
    // Check if admin with entered username exists
    const response = await Axios.get(`http://localhost:3001/admins/${username}`);
    if (!response.data) {
      alert("Admin with that username does not exist!");
      return;
    }
  
    // Verify entered password against hashed password in database
    const loginResponse = await Axios.post('http://localhost:3001/login', { username, password });
    if (!loginResponse.data) {
      alert("Incorrect password!");
      return;
    }
  
    // Set access_token cookie and adminID in local storage, then reload the page
    setCookies('access_token', loginResponse.data.token);
    window.localStorage.setItem('adminID', loginResponse.data.AdminID);
    window.location.reload(false);
  };
/*----------------------------------Password-------------------------------------*/
  /*
  * Validate password format
  * @param password - the password to validate
  * @returns true if the password is valid, false otherwise
  */
  const validatePassword = (password) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return re.test(String(password));
  }

  /*
  * Handle password input change and validate the password
  * @param e - Input change event object
  */
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (!validatePassword(e.target.value)) {
      e.target.setCustomValidity('Password must contain at least 8 characters, including uppercase, lowercase, and numbers');
    } else {
      e.target.setCustomValidity('');
    }
  }
/*---------------------------------------------------------------------------*/
  return (
    <Container>
      <Form className="form" onSubmit={onSubmit}>
        <h2 className="text-black">Login</h2>
        <div className="form-group">
          <Form.Control
            type="text"
            id="username"
            value={username}
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
            required
          ></Form.Control>

          <br></br>
          <Form.Control
            type="password"
            id="password"
            value={password}
            placeholder="password"
            onChange={handlePasswordChange}
            required
          ></Form.Control>
          <br></br>
          <Button variant="success" type="submit">
            Login
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default Auth;


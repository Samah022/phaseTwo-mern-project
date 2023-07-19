import { useState, useEffect } from "react";
import Axios from "axios";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Form,
  Button,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export default function App() {

  // URL of the API that this application will use
  const api = "http://127.0.0.1:3001";

  // Set up state variables to hold user data
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [employeeType, setEmployeeType] = useState("");
  const [image, setImage] = useState("");
  const [yearOfGraduate, setYearOfGraduate] = useState("");

  // Use the useEffect hook to fetch user data when the component mounts
  useEffect(() => {
    Axios.get(`${api}/users`).then((res) => {
      setUsers(res.data);
    });
  }, []);

  /*
  * Handle form submission and create a new user
  * @param e - Form submit event object
  */
  const createUser = (e) => {
    e.preventDefault();

    // Check if a user with that email already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      alert("A user with that email already exists");
      return;
    }
    if (name && phone && email) {
      // Create a new FormData object to hold the form data
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("type", type);
      if (type === "student") {
        formData.append("category", category);
      } else if (type === "employee") {
        formData.append("employeeType", employeeType);
      } else if (type === "graduate") {
        formData.append("yearOfGraduate", yearOfGraduate);
      }
      formData.append("image", image);

      // Use Axios to make a POST request to the API with the form data
      Axios.post(`${api}/createUser`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          // Update the users state variable with the new user data
          setUsers([...users, res.data]);
          // Reset the form inputs
          setName("");
          setEmail("");
          setPhone("");
          setPassword("");
          setType("");
          setCategory("");
          setEmployeeType("");
          setImage("");
          setYearOfGraduate("");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  /*----------------------------------Phone-------------------------------------*/
  /*
  * Format the phone number as (XXX) XXX-XXXX
  * @param phone - the phone number to format
  * @returns a formatted phone number string
  */
  const formatPhoneNumber = (phone) => {
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? + match[1] + match[2] + match[3] : phone;
  }

  /*
  * Handle phone input change and format the phone number
  * @param e - Input change event object
  */
  const handlePhoneChange = (e) => {
    const input = e.target.value.replace(/\D/g, '');
    if (input.length <= 10) {
      setPhone(formatPhoneNumber(input));
    }
  }
  /*---------------------------------------------------------------------------*/

  /*----------------------------------Email-------------------------------------*/
  /*
  * Validate email address format
  * @param email - the email address to validate
  * @returns true if the email address is valid, false otherwise
  */
  const validateEmail = (email) => {
    const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return re.test(String(email).toLowerCase());
  }

  /*
  * Handle email input change and validate the email address
  * @param e - Input change event object
  */
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!validateEmail(e.target.value)) {
      e.target.setCustomValidity('Please enter a valid email address');
    } else {
      e.target.setCustomValidity('');
    }
  }
  /*---------------------------------------------------------------------------*/

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

  /*----------------------------------Type-------------------------------------*/
  /*
  * Handle select type change and reset the category, employee type, and year of graduate inputs
  * @param e - Input change event object
  */
  const handleTypeChange = (e) => {
    setType(e.target.value);
    setCategory("");
    setEmployeeType("");
    setYearOfGraduate("");
  }

  /*
  * Handle select category change
  * @param e - Input change event object
  */
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  }

  /*
  * Handle select employee type change
  * @param e - Input change event object
  */
  const handleEmployeeTypeChange = (e) => {
    setEmployeeType(e.target.value);
  }
  /*---------------------------------------------------------------------------*/

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
              <a href="/app">User</a>
            </li>
          </ul>
        </nav>
      </header>
      {/* Main content section with form to create new user */}
      <Container>
        <Form className="form" onSubmit={createUser}>
          <h2 className="text-black">Create User</h2>
          <Form.Control
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Form.Control
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={handlePhoneChange}
            required
          />
          <Form.Control
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            required
          />
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <Form.Group>
            <Form.Control as="select" value={type} onChange={handleTypeChange} required>
              <option value="">Select type</option>
              <option value="student">Student</option>
              <option value="employee">Employee</option>
              <option value="graduate">Graduate</option>
            </Form.Control>
          </Form.Group>
          {type === "student" &&
            <Form.Group>
              <Form.Control as="select" value={category} onChange={handleCategoryChange} required>
                <option value="">Select category</option>
                <option value="high School">High School</option>
                <option value="university">University</option>
              </Form.Control>
            </Form.Group>
          }
          {type === "employee" &&
            <Form.Group>
              <Form.Control as="select" value={employeeType} onChange={handleEmployeeTypeChange} required>
                <option value="">Select employee type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="freelancer">Freelancer</option>
              </Form.Control>
            </Form.Group>
          }
          {type === "graduate" && (
            <Form.Group>
              <DatePicker
                selected={yearOfGraduate}
                onChange={(date) => setYearOfGraduate(date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="Select year of graduate"
                required
              />
            </Form.Group>
          )}

          <Form.Group controlId="image" >
            <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" required />
          </Form.Group>

          <Button variant="success" type="submit">
            Create User
          </Button>
        </Form>
      </Container>
    </>
  );
}
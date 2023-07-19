import { useState, useEffect } from "react";
import Axios from "axios";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Table,
  Button,
  DropdownButton,
  Dropdown,
  Form,
} from "react-bootstrap";
import moment from 'moment';

/**
 * Component to display user information
 */
export default function Info() {
  const api = "http://127.0.0.1:3001";

  const [users, setUsers] = useState([]); // State variable to store user data
  const [selectedType, setSelectedType] = useState("all"); // State variable to store the currently selected user type
  const [selectedUsers, setSelectedUsers] = useState([]); // State variable to store the currently selected users to delete
  const [selectedUser, setSelectedUser] = useState(null); // State variable to store the ID of the user being edited
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editType, setEditType] = useState("");

  const [editCategory, setEditCategory] = useState("");
  const [editEmployeeType, setEditEmployeeType] = useState("");
  const [editYearOfGraduate, setEditYearOfGraduate] = useState("");

  const [editImage, setEditImage] = useState(null);

  useEffect(() => {
    Axios.get(`${api}/users`).then((res) => { // Send GET request to /users endpoint to retrieve user data
      setUsers(res.data); // Update state variable with retrieved data
    });
  }, []);

  /**
   * Function to open image URL in a new window
   * @param imageUrl - URL of the image to open
   */
  const openImage = (image) => {
    window.open(image, "_blank"); // Open image URL in a new window when user clicks "View Image" button
  };

  /**
   * Function to handle user type selection from dropdown menu
   * @param type - Selected user type
   */
  const handleTypeSelect = (type) => {
    setSelectedType(type); // Update state variable with the selected user type
  };

  /**
   * Function to handle checkbox selection
   * @param id - ID of the user to select or deselect
   */
  const handleCheckboxSelect = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id)); // remove user from the selected users array if it is already selected
    } else {
      setSelectedUsers([...selectedUsers, id]); // add user to the selected users array if it is not already selected
    }
  };

  const filteredUsers =
    selectedType === "all"
      ? users
      : users.filter((user) => user.type === selectedType); // Filter user data based on selected user type

  /**
   * Function to delete selected users from the table and the database
   */
  const deleteSelectedUsers = () => {
    Axios.delete(`${api}/users`, { data: { ids: selectedUsers } }).then((res) => { // Send DELETE request to /users endpoint to delete selected users from the database
      setUsers(users.filter((user) => !selectedUsers.includes(user._id))); // Update state variable with updated user data after deletion
      setSelectedUsers([]);
    });
  };

  /**
   * Function to handle editing user information
   * @param id - ID of the user being edited
   */
  const handleEdit = (id) => {
    setSelectedUser(id); // Set the ID of the user being edited
    const user = users.find((user) => user._id === id); // Find the user data for the selected user
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone);
    setEditType(user.type);
    setEditCategory(user.category);
    setEditEmployeeType(user.employeeType);
    setEditYearOfGraduate(moment(user.date).format('MM/DD/YYYY'));
    setEditImage(null);
  };

  /**
   * Function to handle selecting a new image file
   * @param e - Input change event
   */
  const handleImageSelect = (e) => {
    setEditImage(e.target.files[0]); // Set the new image file in the state variable
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", editName);
    formData.append("email", editEmail);
    formData.append("phone", editPhone);
    formData.append("type", editType);

    // Check if the value of editCategory is a valid enum value  
    if (["high School", "university"].includes(editCategory)) {
      formData.append("category", editCategory);
    } else {
      // If the value is not a valid enum value, set the category field to null    
      formData.append("category", null);
    }

    // Check if the value of editEmployeeType is a valid enum value
    if (["full-time", "part-time", "freelancer"].includes(editEmployeeType)) {
      formData.append("employeeType", editEmployeeType);
    } else {
      // If the value is not a valid enum value, set the employeeType field to null   
      formData.append("employeeType", null);
    }

    if (editYearOfGraduate) {
      formData.append("yearOfGraduate", editYearOfGraduate);
    }

    if (editImage) {
      formData.append("image", editImage);
    }

    Axios.put(`${api}/users`, {
      userId: selectedUser,
      name: editName,
      email: editEmail,
      phone: editPhone,
      type: editType,
      category: editCategory,
      employeeType: editEmployeeType,
      yearOfGraduate: editYearOfGraduate,
      image: editImage
    }).then(res => {
      const updatedUser = res.data;
      
      updatedUser.image = URL.createObjectURL(editImage);

      const index = users.findIndex(user => user._id === updatedUser._id);  

      const updatedUsers = users.map(user => {
        if (user._id === updatedUser._id) {
          return updatedUser;
        } else {
          return user;
        }
      });
      updatedUsers[index] = updatedUser;

      setUsers(updatedUsers);
      setSelectedUser(null);
      setEditName("");
      setEditEmail("");
      setEditPhone("");
      setEditType("");
      setEditCategory("");
      setEditEmployeeType("");
      setEditYearOfGraduate("");
      setEditImage(null);
    });

  };

  return (
    <>
      <Container>
        {/* Dropdown menu to filter users by type */}
        <div className="my-3 d-flex justify-content-end">
          <DropdownButton
            id="dropdown-basic-button"
            title={`Filter by Type: ${selectedType}`}
          >
            <Dropdown.Item onClick={() => handleTypeSelect("all")}>
              All
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleTypeSelect("student")}>
              Student
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleTypeSelect("graduate")}>
              Graduate
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleTypeSelect("employee")}>
              Employee
            </Dropdown.Item>
          </DropdownButton>
        </div>

        {/* Table to display user information */}
        <Table striped bordered hover className="my-3">
          <thead>
            <tr>
              <th>
                <Form.Check
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers(filteredUsers.map((user) => user._id)); // select all visible users if the "Select All" checkbox is checked
                    } else {
                      setSelectedUsers([]); // deselect all visible users if the "Select All" checkbox is unchecked
                    }
                  }}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Type</th>
              <th>Addtional Information</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleCheckboxSelect(user._id)}
                  />
                </td>

                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.type}</td>
                <td>
                  {user.type === "student" && user.category}
                  {user.type === "graduate" && moment(user.date).format('MM/DD/YYYY')}
                  {user.type === "employee" && user.employeeType}
                </td>
                <td>

                  <Button
                    variant="primary"
                    onClick={() => openImage(user.image)}
                  >
                    View Image
                  </Button>{" "}
                </td>

                <td>
                  <Button variant="warning" onClick={() => handleEdit(user._id)}>Edit</Button>{" "}
                </td>

              </tr>
            ))}
          </tbody>
        </Table>

        {/* Button to delete selected users */}
        {selectedUsers.length > 0 && (
          <Button variant="danger" onClick={deleteSelectedUsers}>
            Delete Selected Users
          </Button>
        )}

        {/* Edit user form */}
        {selectedUser && (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicName">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email Address:</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPhone">
              <Form.Label>Phone Number:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicType">
              <Form.Label>Type:</Form.Label>
              <Form.Control
                as="select"
                value={editType}
                onChange={(e) => setEditType(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="graduate">Graduate</option>
                <option value="employee">Employee</option>
              </Form.Control>
            </Form.Group>

            {editType === "student" && (
              <Form.Group controlId="formBasicCategory">
                <Form.Label>Student Type:</Form.Label>
                <Form.Control
                  as="select"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                >
                  <option value="high School">High School</option>
                  <option value="university">University</option>
                </Form.Control>
              </Form.Group>
            )}

            {editType === "graduate" && (
              <Form.Group controlId="formBasicYearOfGraduate">
                <Form.Label>Date of Graduate:</Form.Label>
                <Form.Control
                  type="date"
                  value={editCategory}
                  onChange={(e) => setEditYearOfGraduate(e.target.value)}
                />
              </Form.Group>
            )}

            {editType === "employee" && (
              <Form.Group controlId="formBasicEmployeeType">
                <Form.Label>Employee Type:</Form.Label>
                <Form.Control
                  as="select"
                  value={editCategory}
                  onChange={(e) => setEditEmployeeType(e.target.value)}
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="freelancer">Freelancer</option>
                </Form.Control>
              </Form.Group>
            )}

            <Form.Group controlId="formImage">
              <Form.Label>New Image:</Form.Label>
              <Form.Control type="file" onChange={handleImageSelect} accept="image/*" required />
            </Form.Group>

            <Button variant="primary" type="submit">
              Save
            </Button>{" "}

            <Button variant="secondary" onClick={() => setSelectedUser(null)} >
              Cancel
            </Button>
          </Form>
        )}
      </Container>
    </>
  );
}
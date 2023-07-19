/*-------------------------------CREAT SERVER------------------------------------- */

/*-------------------------------- Users Model -----------------------------------*/

// Import Express
const express = require("express");
const app = express(); // Create Express app instance

// Set port number
const _PORT = process.env.PORT;

// Import the CORS middleware to handle cross-origin requests
const cors = require("cors");
app.use(cors());

// Import the body-parser middleware to handle JSON data in the request body
app.use(express.json());

// Import the bcrypt and jwt packages for authentication and authorization
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Connect to the MongoDB database using Mongoose
const username = process.env.USERNAME,
      password = process.env.PASSWORD,
      database = process.env.DB;

const mongoose = require("mongoose");
mongoose.connect(
  `mongodb+srv://${username}:${password}@cluster0.ms8zds7.mongodb.net/${database}?retryWrites=true&w=majority`
);

// Import the User model to interact with the database
const UserModel = require("./models/Users");

// Define a GET route to retrieve all users from the database
app.get("/users", async (req, res) => {
  const users = await UserModel.find();
  res.json(users);
});

// Use Multer to handle file uploads for the image field
const multer = require("multer");

const path = require("path");

// Set storage engine for uploaded files
const storage = multer.diskStorage({
  destination: "../client/public/uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

// Serve static files from the public directory
app.use(express.static('../client/public'));
app.use("/uploads", express.static(`uploads`));

// Initialize Multer upload middleware
const upload = multer({
  storage
}).single("image");

// Define a POST route to create a new user in the database
app.post("/createUser", async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      // Handle upload error
      console.log(err);
      return res.status(500).send(err);
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new User instance with data from the request body
    const newUser = new UserModel({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      password: hashedPassword,
      type: req.body.type,
      category: req.body.category,
      employeeType: req.body.employeeType,
      yearOfGraduate: req.body.yearOfGraduate,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    // Save the new user to the database
    await newUser.save();
    const user = newUser.toObject();
    user.imageUrl = newUser.image;
    delete user.image;
    res.json(user);
  });
});

// Define a DELETE route to delete a user from the database
app.delete('/users', (req, res) => {
  const userIds = req.body.ids;
  UserModel.deleteMany({ _id: { $in: userIds } })
    .then(() => {
      res.status(200).send("Users deleted successfully");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

//Edite user information 
app.put("/users", async (req, res) => {
  const id = req.body.userId;  
  const { name, phone, email, type, category, employeeType, yearOfGraduate } = req.body;

  const user = await UserModel.findById(id);
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.name = name;   
  user.phone = phone;  
  user.email = email;   
  user.type = type;   
  user.category = category;   
  user.employeeType = employeeType;  
  user.yearOfGraduate = yearOfGraduate; 
  
  // Save updated data to database  
  await user.save();

  const updatedUser = user.toObject();
  updatedUser.imageUrl = user.image;   
  delete updatedUser.image;
  
  res.json(updatedUser);  
});

/*----------------------- Admin Model -----------------------------------*/

// Import the Admin model to interact with the database
const AdminModel = require("./models/Admins");

// Define a POST route to register a new admin user
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const admin = await AdminModel.findOne({ username });

  if (admin) {
    return res.json({ message: "Admin already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  // Create a new Admin instance with data from the request body
  const newAdmin = new AdminModel({
    username: username,
    password: hashedPassword,
  });

  // Save the new admin user to the database
  await newAdmin.save();
  res.json({ message: "Admin created successfully" });
});

// Define a POST route to log in an admin user
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Find the admin user in the database by username
  const admin = await AdminModel.findOne({ username });

  if (!admin) {
    return res.json({ message: "Admin doesn't exist" });
  }

  // Check if the entered password matches the hashed password in the database
  const isPasswordValid = await bcrypt.compare(password, admin.password);

  if (!isPasswordValid) {
    return res.json({ message: "Username or Password is not correct" });
  }

 // Create a JWT token for the authenticated user
  const token = jwt.sign({ id: admin._id }, process.env.SECRET);

  return res.json({ token, adminID: admin._id });
});

// Start listening on the specified port
app.listen(_PORT, () => {
  console.log("Server is listening on port " + _PORT);
});

app.get('/admins/:username', async (req, res) => {
  const admin = await AdminModel.findOne({ username: req.params.username });
  res.json(admin);
});
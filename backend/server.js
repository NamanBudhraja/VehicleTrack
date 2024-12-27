const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config({ path: "./.env" });

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;
mongoose.connect(process.env.MONGO_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

// MongoDB Schema for Car
const carSchema = new mongoose.Schema({
  companyName: String,
  distanceCovered: Number,
  mileage: Number,
  serviceDates: [Date],
  owner: {
    name: String,
    email: String,
  },
  image: String,
});

const Car = mongoose.model("Car", carSchema);
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
});
const User = mongoose.model("User", userSchema);
// API Endpoints
// Get all cars
app.get("/api/cars", async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a specific car by ID
app.get("/api/cars/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/pro", async (req, res) => {
  try {
    const { ownerEmail } = req.query;

    if (!ownerEmail) {
      console.warn("No ownerEmail provided in query parameters.");
      return res
        .status(400)
        .json({ message: "ownerEmail query parameter is required" });
    }

    console.log(`Searching for cars with ownerEmail: ${ownerEmail}`);

    // Fetch cars from the database
    const cars = await Car.find({ "owner.email": ownerEmail });

    if (!cars || cars.length === 0) {
      console.log(`No cars found for ownerEmail: ${ownerEmail}`);
      return res.status(404).json({ message: "No cars found for this owner." });
    }

    console.log(`Found ${cars.length} cars for ownerEmail: ${ownerEmail}`);
    return res.status(200).json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    return res
      .status(500)
      .json({ message: "Error fetching cars", error: error.message });
  }
});

// Add a new car
app.post("/api/cars", async (req, res) => {
  try {
    const newCar = new Car(req.body);
    await newCar.save(); 
    res.status(201).json(newCar); 
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a car by ID
app.put("/api/cars/:id", async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedCar) {
      return res.status(404).json({ error: "Car not found" });
    }
    res.json(updatedCar);
  } catch (error) {
    res.status(400).json({ error: "Bad Request" });
  }
});
// Delete a car by ID
/*app.delete("/api/cars/:id", async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) {
      return res.status(404).json({ error: "Car not found" });
    }
    console.log("car is deleted successfully");

    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});*/
app.delete("/api/cars/:id", async (req, res) => {
  const { id } = req.params;
  // const { email } = req.body; // Assuming email is sent in the body

  try {
    const car = await Car.findById(id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    await Car.findByIdAndDelete(id);
    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/createuser", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User with this email already exists!" });
    }

    // Create and save new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
const bcrypt = require("bcrypt");

app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not registered!" });
    }

    // Check if the password is correct
    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = password === user.password;
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password!" });
    }

    // Authentication successful
    res.status(200).json({ message: "Sign-in successful!", user });
  } catch (error) {
    console.error("Server error:", error.message); // Log the exact error
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require("express");
const bcrypt = require("bcryptjs");
const Employee = require("../models/Employee");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Register employee
router.post("/register", async (req, res) => {
    console.log("REGISTER ROUTE HIT");
  try {
    const { name, employeeId, password } = req.body;

    // Check all fields
    if (!name || !employeeId || !password) {
      return res.status(400).json({
        message: "Please fill in all fields.",
      });
    }

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({ employeeId });

    if (existingEmployee) {
      return res.status(400).json({
        message: "Employee ID already registered.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create employee
    const employee = new Employee({
      name,
      employeeId,
      password: hashedPassword,
    });

    await employee.save();

    res.status(201).json({
      message: "Registration successful!",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error during registration.",
    });
  }
});
// Login employee
router.post("/login", async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    // Check fields
    if (!employeeId || !password) {
      return res.status(400).json({
        message: "Please enter Employee ID and password.",
      });
    }

    // Find employee
    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(401).json({
        message: "Invalid Employee ID or password.",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      employee.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid Employee ID or password.",
      });
    }
    const token = jwt.sign(
  {
    id: employee._id,
    employeeId: employee.employeeId,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "1d",
  }
);
  res.status(200).json({
  message: "Login successful!",
  token,
  employee: {
    id: employee._id,
    name: employee.name,
    employeeId: employee.employeeId,
  },
});
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error during login.",
    });
  }
});
module.exports = router;
const UserModel = require("../../models/User/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Sign up (Create new user)
exports.signUp = async (req, res) => {
  try {
    const { mobile, name, password } = req.body;

    if (!mobile || !name || !password) {
      return res
        .status(400)
        .json({ status: "fail", message: "All fields are required." });
    }

    const existingUser = await UserModel.findOne({ mobile });
    if (existingUser) {
      return res
        .status(409)
        .json({ status: "fail", message: "Mobile already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      mobile,
      name,
      password: hashedPassword,
    });

    res.status(201).json({
      status: "success",
      message: "User registered successfully.",
      data: {
        id:newUser._id,
        mobile: newUser.mobile,
        name: newUser.name,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "fail", message: "Server error.", error: error.message });
  }
};

// Sign in
exports.signIn = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res
        .status(400)
        .json({ status: "fail", message: "Mobile and password are required." });
    }

    const user = await UserModel.findOne({ mobile });
    if (!user) {
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid credentials." });
    }

    const payload = {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12,
      data: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.cookie('token', token, cookieOptions);

    res.status(200).json({
      status: "success",
      message: "User signed in successfully.",
      token: token,
      data: {
        id:user._id,
        name:user.name,
        mobile:user.mobile
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "fail", message: "Server error.", error: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "fail", message: "Server error.", error: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found." });
    }

    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    res
      .status(500)
      .json({ status: "fail", message: "Server error.", error: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { mobile, name, password } = req.body;

    const updatedFields = {};
    if (mobile) updatedFields.mobile = mobile;
    if (name) updatedFields.name = name;
    if (password) updatedFields.password = await bcrypt.hash(password, 10);

    const updatedUser = await UserModel.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found." });
    }

    res.status(200).json({
      status: "success",
      message: "User updated successfully.",
      data: {
        _id:updatedUser._id,
        mobile:updatedUser.mobile,
        name:updatedUser.name
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "fail", message: "Server error.", error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await UserModel.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found." });
    }

    res
      .status(200)
      .json({ status: "success", message: "User deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ status: "fail", message: "Server error.", error: error.message });
  }
};

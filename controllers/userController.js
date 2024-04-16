import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Get all users
export const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (error) {
    return console.log(error);
  }
  if (!users) {
    return res.status(500).json({
      message: "User not found",
    });
  }
  return res.status(200).json({ users });
};

// Sign up
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Kiểm tra xem email hoặc username đã tồn tại trong cơ sở dữ liệu chưa
  const existingUser = await User.findOne({
    $or: [{ email: email }, { username: username }],
  });
  if (existingUser) {
    // Nếu email hoặc username đã tồn tại, trả về thông báo lỗi
    return res
      .status(422)
      .json({ message: "Email or username already exists" });
  }

  // Nếu email và username chưa tồn tại, tiếp tục với quy trình đăng ký bình thường
  if (!username.trim() || !email.trim() || !password.trim()) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  const hashedPassword = bcrypt.hashSync(password);
  try {
    let user = new User({ username, email, password: hashedPassword });
    user = await user.save();
    if (!user) {
      return res.status(500).json({ message: "Unexpected Error Occurred" });
    }
    return res.status(201).json({
      message: "Register Successful",
      user: user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unexpected Error Occurred" });
  }
};

// Login
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && email.trim() === "" && !password && password.trim() === "") {
    return res.status(422).json({ message: "Invalid Inputs" });
  }
  let user;
  try {
    user = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }

  if (!user) {
    return res
      .status(404)
      .json({ message: "Unable to find user from this ID" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  return res.status(200).json({ message: "Login Successfull", user });
};

// Get user by id
export const getUserById = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findById(id);
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Unexpected Error Occured" });
  }
  return res.status(200).json({ user });
};

// Delete a user
export const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findByIdAndDelete(id);
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  return res.status(200).json({ message: "Deleted Successfully" });
};

// Update a user
export const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const {
    username,
    email,
    fullName,
    dateOfBirth,
    gender,
    phoneNumber,
    address,
    password,
  } = req.body;

  // Kiểm tra xem người dùng đã cung cấp ít nhất một trường thông tin mới để cập nhật
  if (
    !username &&
    !email &&
    !fullName &&
    !dateOfBirth &&
    !gender &&
    !phoneNumber &&
    !address &&
    !password
  ) {
    return res
      .status(422)
      .json({ message: "At least one field is required to update" });
  }

  // Hash mật khẩu mới nếu được cung cấp
  let hashedPassword;
  if (password) {
    hashedPassword = bcrypt.hashSync(password);
  }

  let user;
  try {
    // Xây dựng đối tượng chứa các trường thông tin mới được cập nhật
    const updatedFields = {};
    if (username) updatedFields.username = username;
    if (email) updatedFields.email = email;
    if (fullName) updatedFields.fullName = fullName;
    if (dateOfBirth) updatedFields.dateOfBirth = dateOfBirth;
    if (gender) updatedFields.gender = gender;
    if (phoneNumber) updatedFields.phoneNumber = phoneNumber;
    if (address) updatedFields.address = address;
    if (hashedPassword) updatedFields.password = hashedPassword;

    // Cập nhật người dùng trong cơ sở dữ liệu
    user = await User.findByIdAndUpdate(id, updatedFields, { new: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }

  if (!user) {
    return res.status(500).json({ message: "User not found" });
  }

  res.status(200).json({ message: "Updated successfully", user: user });
};

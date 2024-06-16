import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Movie from "../models/Movie.js";
import Theater from "../models/Theater.js";

export const signUpAdmin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && email.trim() === "" && !password && password.trim() === "") {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({ email });
  } catch (err) {
    return console.log(err);
  }

  if (existingAdmin) {
    return res.status(400).json({ message: "Admin already exists" });
  }

  let admin;
  const hashedPassword = bcrypt.hashSync(password);
  try {
    admin = new Admin({ email, password: hashedPassword });
    admin = await admin.save();
  } catch (err) {
    return console.log(err);
  }
  if (!admin) {
    return res.status(500).json({ message: "Unable to store admin" });
  }
  return res.status(201).json({ admin });
};

export const adminLogin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && email.trim() === "" && !password && password.trim() === "") {
    return res.status(422).json({ message: "Invalid Inputs" });
  }
  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (!existingAdmin) {
    return res.status(400).json({ message: "Admin not found" });
  }
  const isPasswordCorrect = bcrypt.compareSync(
    password,
    existingAdmin.password
  );

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  const token = jwt.sign({ id: existingAdmin._id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });

  return res.status(200).json({
    message: "Authentication Complete",
    existingAdmin,
    token,
  });
};

export const getAdmins = async (req, res, next) => {
  let admins;
  try {
    admins = await Admin.find();
  } catch (err) {
    return console.log(err);
  }
  if (!admins) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
  return res.status(200).json({ admins });
};

export const getAdminById = async (req, res, next) => {
  const id = req.params.id;

  let admin;
  try {
    admin = await Admin.findById(id).populate("addedMovies");
  } catch (err) {
    return console.log(err);
  }
  if (!admin) {
    return console.log("Cannot find Admin");
  }
  return res.status(200).json({ admin });
};


export async function addRandomTheatersToMovies(req, res, next) {
  const theatersList = [
    "CGV Aeon Long Bien",
    "CGV Ho Guom Plaza",
    "CGV Rice City",
    "CGV Vincom Center Ba Trieu",
    "CGV Vincom Nguyen Chi Thanh",
    "CGV Vincom Royal City",
    "CGV Vincom Times City",
    "CGV Vincom Long Bien",
    "CGV Truong Dinh Plaza",
    "CGV Trang Tien Plaza"
  ];
  try {
    // Lấy danh sách phim từ cơ sở dữ liệu
    const movies = await Movie.find();

    // Lặp qua từng phim
    for (const movie of movies) {
      // Random số lượng rạp chiếu từ 1 đến 5
      const numberOfTheaters = Math.floor(Math.random() * 5) + 1;
      const randomTheaters = [];

      // Random tên rạp chiếu và thêm vào mảng
      for (let i = 0; i < numberOfTheaters; i++) {
        const randomIndex = Math.floor(Math.random() * theatersList.length);
        randomTheaters.push(theatersList[randomIndex]);
      }

      // Gán mảng rạp chiếu vào thuộc tính theaters của phim
      movie.theaters = randomTheaters;

      // Lưu lại thay đổi vào cơ sở dữ liệu
      await movie.save();
    }

    console.log('Dữ liệu theaters đã được thêm ngẫu nhiên vào các phim thành công!');
  } catch (error) {
    console.error('Lỗi khi thêm dữ liệu theaters ngẫu nhiên:', error.message);
  }
}

export async function addTheater(name, location) {
  try {
    // Tạo một đối tượng rạp chiếu mới từ dữ liệu được cung cấp
    const newTheater = new Theater({
      name: name,
      location: location
    });
    
    // Lưu đối tượng vào cơ sở dữ liệu
    await newTheater.save();
    
    console.log(`Rạp chiếu "${name}" đã được thêm vào cơ sở dữ liệu thành công!`);
  } catch (error) {
    console.error('Lỗi khi thêm rạp chiếu vào cơ sở dữ liệu:', error.message);
  }
}

// addTheater("CGV Aeon Long Bien", "Level 4 - AEON Mall Long Bien,27 Co Linh Street - Long Bien District");
// addTheater("CGV Ho Guom Plaza", "110 Trần Phú Hanoi");
// addTheater("CGV Rice City", "Level 2 & 4 - Central Building - Rice City Linh Dam,Hoang Liet Ward - Hoang Mai District Hà Noi");
// addTheater("CGV Vincom Center Ba Trieu", "11Th Floor, 191 Ba Trieu Str Vincom B Bulding, Hà Nội, Hà Nội");
// addTheater("CGV Vincom Nguyen Chi Thanh", "54a Nguyễn Chí Thanh, Q. Đống Đa, Tp. Hà Nội Hanoi");
// addTheater("CGV Vincom Royal City", "72a Đ. Nguyễn Trãi, Thanh Xuân Trung, Thanh Xuân, Hà Nội");
// addTheater("CGV Vincom Times City", "458 Minh Khai, Hai Bà Trưng Hanoi");
// addTheater("CGV Vincom Long Bien", "Tầng 5, Khu đô thị Vinhomes Riverside, Long Biên");
// addTheater("CGV Truong Dinh Plaza", "461 Đường Trương Định Tân Mai Hà Nội");
// addTheater("CGV Trang Tien Plaza", "Hoan Kiem District,Trang Tien Plaza - 24 Hai Ba Trung Hà Noi ");

// async function xoaHetDuLieu() {
//   try {
//       await Theater.deleteMany({});
//       console.log("Đã xóa tất cả dữ liệu trong schema Ticket.");
//   } catch (error) {
//       console.error("Lỗi khi xóa dữ liệu:", error);
//   }
// }

// // Sử dụng hàm xoaHetDuLieu
// xoaHetDuLieu();
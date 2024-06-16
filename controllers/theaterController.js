import Theater from "../models/Theater.js";

export const getAllTheaters = async (req, res) => {
  try {
    // Lấy tất cả các rạp chiếu phim từ cơ sở dữ liệu
    const theaters = await Theater.find();

    // Kiểm tra xem có rạp nào không
    if (theaters.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy rạp chiếu phim." });
    }

    // Trả về danh sách các rạp chiếu phim
    res.status(200).json({ theaters });
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Lỗi khi lấy danh sách rạp chiếu phim:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi lấy danh sách rạp chiếu phim." });
  }
};

export async function findTheaterByName(req, res) {
  const { name } = req.query;

  try {
    const theater = await Theater.findOne({ name });

    if (theater) {
      return res.status(200).json(theater);
    } else {
      return res.status(404).json({ message: "Theater not found" });
    }
  } catch (error) {
    console.error("Error finding theater by name:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const addTheater = async (req, res) => {
  try {
    // Lấy thông tin từ request
    const { name, location } = req.body;

    // const _token = req.headers.authorization || "";
    // const token = _token.split(" ")[1];

    // if (!token) {
    //     return res
    //         .status(401)
    //         .json({ status: "error", message: "Token is missing" });
    // }

    // // Giải mã token
    // const decodedToken = jwt.verify(token, process.env.SECRET_KEY || "");
    // if (decodedToken && decodedToken.email !== email) {
    //     return res.status(401).json({ status: "error", message: "Unauthorized access" });
    // }

    // Tạo một bản ghi voucher mới
    const newTheater = new Theater({
      name,
      location,
    });

    // Lưu bản ghi voucher vào cơ sở dữ liệu
    await newTheater.save();

    res.status(201).json({ status: "success", message: "Theater added successfully" });
  } catch (error) {
    console.error("Error adding theater:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

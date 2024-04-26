import jwt from "jsonwebtoken";
import Voucher from "../models/Voucher.js";
import User from "../models/User.js";

export const getVoucherByEmail = async (req, res) => {
    try {
        // Lấy thông tin từ request
        const { email } = req.query;
        const _token = req.headers.authorization || "";
        const token = _token.split(" ")[1];

        if (!token) {
            return res
                .status(401)
                .json({ status: "error", message: "Token is missing" });
        }

        // Giải mã token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY || "");
        if (decodedToken && decodedToken.email !== email) {
            return res.status(401).json({ status: "error", message: "Unauthorized access" });
        }

        // Tìm bản ghi voucher theo email
        const vouchers = await Voucher.find({ email });
        if (!vouchers) {
            return res.status(404).json({ status: "error", message: "Voucher not found" });
        }
        // Trả về danh sách các voucher
        res.status(200).json({ status: "success", vouchers });
    } catch (error) {
        console.error('Error retrieving voucher:', error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};

export const addVoucher = async (req, res) => {
    try {
        // Lấy thông tin từ request
        const { email, genre, discountPercentage, expirationDate, termsAndConditions } = req.body;

        const _token = req.headers.authorization || "";
        const token = _token.split(" ")[1];

        if (!token) {
            return res
                .status(401)
                .json({ status: "error", message: "Token is missing" });
        }

        // Giải mã token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY || "");
        if (decodedToken && decodedToken.email !== email) {
            return res.status(401).json({ status: "error", message: "Unauthorized access" });
        }

        // Tạo một bản ghi voucher mới
        const newVoucher = new Voucher({
            email,
            genre,
            discountPercentage,
            expirationDate,
            termsAndConditions,
            isUsed: false // Mặc định chưa được sử dụng
        });

        // Lưu bản ghi voucher vào cơ sở dữ liệu
        await newVoucher.save();

        res.status(201).json({ status: "success", message: "Voucher added successfully" });
    } catch (error) {
        console.error('Error adding voucher:', error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};

export const useVoucher = async (req, res) => {
    try {
        // Lấy thông tin từ request
        const { email, voucherId } = req.body;

        const _token = req.headers.authorization || "";
        const token = _token.split(" ")[1];

        if (!token) {
            return res
                .status(401)
                .json({ status: "error", message: "Token is missing" });
        }

        // Giải mã token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY || "");
        if (decodedToken && decodedToken.email) {
            // Tìm kiếm người dùng bằng email từ token
            const user = await User.findOne({ email: decodedToken.email });

            if (!user) {
                return res
                    .status(404)
                    .json({ status: "error", message: "User not found" });
            }
        }

        // Kiểm tra xem voucher có tồn tại không
        const voucher = await Voucher.findById(voucherId);

        if (!voucher) {
            return res.status(404).json({ status: "error", message: "Voucher not found" });
        }

        // Kiểm tra xem voucher đã được sử dụng chưa
        if (voucher.isUsed) {
            return res.status(400).json({ status: "error", message: "Voucher has already been used" });
        }

        // Kiểm tra xem voucher có thuộc email truyền vào không
        if (voucher.email !== email) {
            return res.status(403).json({ status: "error", message: "Voucher does not belong to this user" });
        }

        // Đánh dấu voucher đã được sử dụng
        voucher.isUsed = true;

        // Lưu cập nhật
        await voucher.save();

        res.status(200).json({ status: "success", message: "Voucher has been successfully used" });
    } catch (error) {
        console.error('Error using voucher:', error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};
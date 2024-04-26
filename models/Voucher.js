import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema({
  email: { type: String, required: true },
  genre: [{ type: String, required: true }], // Mảng các thể loại phim áp dụng
  discountPercentage: { type: Number, required: true }, // Phần trăm giảm giá
  isUsed: { type: Boolean, default: false }, // Trạng thái đã sử dụng
  expirationDate: { type: String, required: true }, // Ngày hết hạn
  termsAndConditions: { type: String, required: true } // Điều khoản và điều kiện
});

export default mongoose.model('Voucher', voucherSchema);


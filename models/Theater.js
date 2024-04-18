const mongoose = require('mongoose');

// Schema cho rạp chiếu (theater)
const theaterSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Tên rạp chiếu
  location: { type: String, required: true }, // Địa điểm của rạp chiếu
  showtimes: [{ type: String, required: true }] // Mảng các giờ chiếu
});

// Tạo model từ schema
const Theater = mongoose.model('Theater', theaterSchema);

module.exports = Theater;

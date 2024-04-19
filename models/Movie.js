import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  director: { type: String, required: true },
  genre: [{ type: String, required: true }],
  releaseDate: { type: Date, required: true },
  duration: { type: Number, required: true },
  rating: { type: Number, required: true },
  cast: [{ type: String, required: true }],
  plot: { type: String, required: true },
  reviews: { type: String },
  ticketPrice: { type: Number, required: true },
  theaters: { type: String },
  image: { type: String, required: true },
  bookings: [{ type: mongoose.Types.ObjectId, ref: "Booking" }],
});

export default mongoose.model("Movie", movieSchema);

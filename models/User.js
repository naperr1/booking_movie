import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userShema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  fullName: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ["male", "female", "other"] },
  phoneNumber: { type: String },
  address: { type: String },
  password: { type: String, required: true },
  bookings: [{ type: mongoose.Types.ObjectId, ref: "Booking" }],
});

export default mongoose.model("User", userShema);

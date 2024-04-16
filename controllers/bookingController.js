import mongoose from "mongoose";
import Movie from "../models/Movie.js";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";

export const newBooking = async (req, res, next) => {
  const {
    movieId,
    userId,
    seatNumbers,
    ticketType,
    price,
    bookingDate,
    cinemaLocation,
    voucherId,
    status,
  } = req.body;

  try {
    // Kiểm tra xem movieId và userId có tồn tại không
    const existingMovie = await Movie.findById(movieId);
    console.log(existingMovie);
    const existingUser = await User.findById(userId);
    console.log("existingUser.bookings: ", existingUser.bookings);
    if (!existingMovie) {
      return res.status(404).json({ message: "Movie Not Found With Given ID" });
    }

    if (!existingUser) {
      return res.status(404).json({ message: "User Not Found With Given ID" });
    }

    // Tạo một phiên giao dịch
    const session = await mongoose.startSession();
    session.startTransaction();

    // Tạo một đối tượng Ticket
    const ticket = new Ticket({
      movieId,
      movieName: existingMovie.title,
      movieImage: existingMovie.image,
      userId,
      seatNumbers,
      ticketType,
      price,
      bookingDate: new Date(bookingDate),
      cinemaLocation,
      voucherId,
      status,
    });

    // Thêm ticket vào danh sách booking của user và movie
    existingUser.bookings.push(ticket);
    existingMovie.bookings.push(ticket);

    // Lưu các thay đổi vào cơ sở dữ liệu
    await Promise.all([
      existingUser.save({ session }),
      existingMovie.save({ session }),
      ticket.save({ session }),
    ]);

    // Commit giao dịch
    await session.commitTransaction();
    session.endSession();

    // Trả về phản hồi thành công với thông tin ticket
    return res.status(201).json({ ticket });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getBookingById = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  try {
    booking = await Ticket.findById(id);
  } catch (err) {
    return console.log(err);
  }
  if (!booking) {
    return res.status(500).json({ message: "Unexpected Error" });
  }
  return res.status(200).json({ booking });
};

// export const deleteBooking = async (req, res, next) => {
//   const id = req.params.id;
//   let booking;
//   try {
//     booking = await Ticket.findByIdAndDelete(id).populate("user movieId");

//     console.log(booking);
//     const session = await mongoose.startSession();
//     session.startTransaction();
//     await booking.user.bookings.pull(booking);
//     await booking.movie.bookings.pull(booking);
//     await booking.movie.save({ session });
//     await booking.user.save({ session });
//     session.commitTransaction();
//   } catch (err) {
//     return console.log(err);
//   }
//   if (!booking) {
//     return res.status(500).json({ message: "Unable to Delete" });
//   }
//   return res.status(200).json({ message: "Successfully Deleted" });
// };

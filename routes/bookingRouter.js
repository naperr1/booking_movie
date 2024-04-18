import express from "express";
import {
  getBookingById,
  newBooking,
} from "../controllers/bookingController.js";

const bookingsRouter = express.Router();

bookingsRouter.post("/", newBooking);
bookingsRouter.get("/:id", getBookingById);
// bookingsRouter.delete("/:id", deleteBooking);

export default bookingsRouter;

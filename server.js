import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js";
import cors from "cors";
import adminRouter from "./routes/adminRouter.js";
import movieRouter from "./routes/movieRouter.js";
import bookingsRouter from "./routes/bookingRouter.js";
import theaterRouter from "./routes/theaterRouter.js";
import bookedSeatsRouter from "./routes/bookedSeats.js";

dotenv.config();

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/movie", movieRouter);
app.use("/booking", bookingsRouter);
app.use("/theater", theaterRouter);
app.use("/bookedSeats", bookedSeatsRouter);

mongoose
  .connect(
    `mongodb+srv://movieticket:movieticket@cluster0.i7ges50.mongodb.net/MOVIE_TICKET?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => console.log("DB connection successful"))
  .catch((e) => console.log(e));

app.listen(PORT, (req, res) => {
  console.log(`listening on port ${PORT}`);
});

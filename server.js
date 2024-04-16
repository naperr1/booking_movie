import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import cors from "cors";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.use("/user", userRouter);

mongoose
  .connect(
    `mongodb+srv://movieticket:movieticket@cluster0.i7ges50.mongodb.net/MOVIE_TICKET?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => console.log("DB connection successful"))
  .catch((e) => console.log(e));

app.listen(PORT, (req, res) => {
  console.log(`listening on port ${PORT}`);
});

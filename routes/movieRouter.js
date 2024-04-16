import express from "express";
import {
  addMovie,
  getAllMovies,
  getMovieById,
} from "../controllers/movieController.js";

const movieRouter = express.Router();

movieRouter.post("/", addMovie);
movieRouter.get("/getAllMovie", getAllMovies);
movieRouter.get("/:id", getMovieById);

export default movieRouter;

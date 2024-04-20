import express from "express";
import {
  addMovie,
  filterMoviesByGenre,
  getAllMovies,
  getMovieById,
  searchMovies,
  sortMoviesByGenre,
} from "../controllers/movieController.js";

const movieRouter = express.Router();

movieRouter.post("/", addMovie);
movieRouter.get("/getAllMovie", getAllMovies);
movieRouter.get("/search", searchMovies);
movieRouter.get("/sort-by-genre", sortMoviesByGenre);
movieRouter.get("/filter-by-genre", filterMoviesByGenre);
movieRouter.get("/:id", getMovieById);

export default movieRouter;

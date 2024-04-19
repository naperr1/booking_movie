import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import Movie from "../models/Movie.js";

// export const addMovie = async (req, res, next) => {
//   if (!req.headers.authorization) {
//     return res.status(401).json({ message: "Authorization header is missing" });
//   }

//   const extractedToken = req.headers.authorization.split(" ")[1];
//   if (!extractedToken || extractedToken.trim() === "") {
//     return res.status(404).json({ message: "Token Not Found" });
//   }

//   let adminId;

//   // Verify token
//   jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
//     if (err) {
//       return res.status(400).json({ message: `${err.message}` });
//     } else {
//       adminId = decrypted.id;
//       return;
//     }
//   });

//   // Create new movie
//   const {
//     title,
//     director,
//     genre,
//     releaseDate,
//     duration,
//     image,
//     rating,
//     cast,
//     plot,
//   } = req.body;

//   // Check for missing or empty required fields
//   if (
//     !title ||
//     title.trim() === "" ||
//     !director ||
//     director.trim() === "" ||
//     !genre ||
//     genre.length === 0 ||
//     !releaseDate ||
//     !duration ||
//     !image ||
//     image.trim() === "" ||
//     !rating ||
//     !cast ||
//     cast.length === 0 ||
//     !plot ||
//     plot.trim() === ""
//   ) {
//     return res.status(422).json({ message: "Invalid Inputs" });
//   }

//   let movie;
//   try {
//     movie = new Movie({
//       title,
//       director,
//       genre,
//       releaseDate: new Date(releaseDate),
//       duration,
//       image,
//       rating,
//       cast,
//       plot,
//     });

//     const session = await mongoose.startSession();
//     session.startTransaction();
//     await movie.save({ session });

//     const adminUser = await Admin.findById(adminId);
//     if (!adminUser) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ message: "Admin not found" });
//     }

//     adminUser.addedMovies.push(movie);
//     await adminUser.save({ session });
//     await session.commitTransaction();
//     session.endSession();
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Request Failed" });
//   }

//   if (!movie) {
//     return res.status(500).json({ message: "Request Failed" });
//   }

//   return res.status(201).json({ movie });
// };

export const addMovie = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  const extractedToken = req.headers.authorization.split(" ")[1];
  if (!extractedToken || extractedToken.trim() === "") {
    return res.status(404).json({ message: "Token Not Found" });
  }

  let adminId;

  // Verify token
  jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
    if (err) {
      return res.status(400).json({ message: `${err.message}` });
    } else {
      adminId = decrypted.id;
      return;
    }
  });

  // Create new movie
  const {
    title,
    director,
    genre,
    releaseDate,
    duration,
    rating,
    cast,
    plot,
    reviews,
    ticketPrice,
    theaters,
    image,
  } = req.body;

  // Check for missing or empty required fields
  if (
    !title ||
    title.trim() === "" ||
    !director ||
    director.trim() === "" ||
    !genre ||
    genre.length === 0 ||
    !releaseDate ||
    !duration ||
    !image ||
    image.trim() === "" ||
    !rating ||
    !cast ||
    cast.length === 0 ||
    !plot ||
    plot.trim() === "" ||
    !ticketPrice
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  let movie;
  try {
    movie = new Movie({
      title,
      director,
      genre,
      releaseDate: new Date(releaseDate),
      duration,
      rating,
      cast,
      plot,
      reviews,
      ticketPrice,
      theaters,
      image,
    });

    const session = await mongoose.startSession();
    session.startTransaction();
    await movie.save({ session });

    const adminUser = await Admin.findById(adminId);
    if (!adminUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Admin not found" });
    }

    adminUser.addedMovies.push(movie);
    await adminUser.save({ session });
    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Request Failed" });
  }

  if (!movie) {
    return res.status(500).json({ message: "Request Failed" });
  }

  return res.status(201).json({ movie });
};

export const getAllMovies = async (req, res, next) => {
  let movies;

  try {
    movies = await Movie.find();
  } catch (err) {
    return console.log(err);
  }

  if (!movies) {
    return res.status(500).json({ message: "Request Failed" });
  }
  return res.status(200).json({ movies });
};

export const getMovieById = async (req, res, next) => {
  const id = req.params.id;
  let movie;
  try {
    movie = await Movie.findById(id);
  } catch (err) {
    return console.log(err);
  }

  if (!movie) {
    return res.status(404).json({ message: "Invalid Movie ID" });
  }

  return res.status(200).json({ movie });
};

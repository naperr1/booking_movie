import express from "express";
import {
  signUpAdmin,
  adminLogin,
  getAdminById,
  getAdmins,
  addRandomTheatersToMovies,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/signup", signUpAdmin);
adminRouter.post("/login", adminLogin);
adminRouter.post("/addRandomTheatersToMovies", addRandomTheatersToMovies);
adminRouter.get("/", getAdmins);
adminRouter.get("/:id", getAdminById);

export default adminRouter;

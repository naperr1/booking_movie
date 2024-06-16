import express from "express";
import { addTheater, findTheaterByName, getAllTheaters } from "../controllers/theaterController.js";

const theaterRouter = express.Router();

theaterRouter.get("/getAllTheater", getAllTheaters);
theaterRouter.get("/findTheaterByName", findTheaterByName);
theaterRouter.post("/", addTheater);

export default theaterRouter;

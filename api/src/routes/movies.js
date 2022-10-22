import { Router } from "express";
import { MoviesController } from "../controllers/movies.controller.js";

const { addMovie, addPersonToMovie, getMovies, getMovieById } =
  MoviesController;

const router = Router();

// POST
router.post("/add/movie", addMovie);
router.post("/add/personToMovie", addPersonToMovie);

// GET
router.get("/", getMovies);
router.get("/:id", getMovieById);

export default router;

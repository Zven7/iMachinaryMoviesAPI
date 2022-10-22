import { Movie } from "../models/movie.js";
import { Person } from "../models/person.js";
import { MoviesActors } from "./movies_people.js";

Movie.belongsToMany(Person, { through: MoviesActors });
Person.belongsToMany(Movie, { through: MoviesActors });

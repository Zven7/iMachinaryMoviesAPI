import { Person } from "../models/person.js";
import { Movie } from "../models/movie.js";
import { MoviesActors } from "../models/movies_people.js";

const Helper = {
  unwindPersonJoinTable: async (personId, movieId) => {
    const joinTableData = await MoviesActors.findAll({
      where: { personId: personId, movieId: movieId },
    });
    let resolvedPromises = await Promise.all(joinTableData).then((val, i) => {
      return val;
    });
    let finalRes = resolvedPromises[0]?.dataValues;

    return finalRes;
  },

  getPersonMovies: async (movies) => {
    const moviesArray = movies.map(async (mov) => {
      let res = await Movie.findOne({
        where: { id: mov.dataValues.movieId },
        attributes: ["id", "title", "year"],
      });
      return res;
    });

    let resolvedPromises = await Promise.all(moviesArray).then((val, i) => {
      return val;
    });
    let finalRes = resolvedPromises.map((m) => {
      return m.dataValues;
    });

    return finalRes;
  },

  getMoviePersons: async (persons) => {
    const personsArray = persons.map(async (p) => {
      let res = await Person.findOne({
        where: { id: p.dataValues.personId },
        attributes: ["id", "name", "lastName", "age"],
      });
      return res;
    });

    let resolvedPromises = await Promise.all(personsArray).then((val, i) => {
      return val;
    });

    let finalRes = resolvedPromises.map((m) => {
      return m.dataValues;
    });

    return finalRes;
  },
};

export default Helper;

import Helper from "../utils/index.js";

import { Sequelize } from "sequelize";
import { Person } from "../models/person.js";
import { Movie } from "../models/movie.js";
import { MoviesActors } from "../models/movies_people.js";

const { unwindPersonJoinTable, getMoviePersons } = Helper;

export const MoviesController = {
  async addMovie(req, res) {
    const { title, year } = req.body;

    try {
      const movieCreated = await Movie.create({
        title: title,
        year: year,
      });

      return res.json({ created: movieCreated });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  async addPersonToMovie(req, res) {
    try {
      const { personID, movieID, role } = req.body;
      // This array is used to check if the role value obtained from the request body is valid
      const ARR_FOR_CONDITIONAL = ["CAST", "PROD", "DIR"];

      //Auxiliary variable to populate with the role value
      let aux;

      const person = await Person.findOne({ where: { id: personID } });
      const movie = await Movie.findOne({ where: { id: movieID } });

      const unwindedJoinTable = await unwindPersonJoinTable(personID, movieID);

      if (unwindedJoinTable != undefined) {
        aux = unwindedJoinTable.role;
      } else {
        aux = [];
      }

      if (aux.includes(role) === false && ARR_FOR_CONDITIONAL.includes(role)) {
        await movie.addPeople(person, { through: { role: [...aux, role] } });
        return res.json({ updated: movie, msg: "Person added successfully" });
      } else if (!ARR_FOR_CONDITIONAL.includes(role)) {
        return res.status(400).json({ msg: "Invalid Request" });
      } else {
        return res.json({ msg: "Person already added with requested role." });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  async getAllData(_, res) {
    try {
      /* const data = await Person.findAll({
          include: [{ model: Movie }],
        }); */
      const people = await Person.findAll();
      const movies = await Movie.findAll();

      return res.json({ movieList: movies, peopleList: people });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  async getMovies(_, res) {
    try {
      const movies = await Movie.findAll();

      return res.json(movies);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  async getMovieById(req, res) {
    try {
      const { id } = req.params;
      const directorsDB = await MoviesActors.findAll({
        where: {
          [Sequelize.Op.and]: [
            { movieId: id },
            { role: { [Sequelize.Op.contains]: ["DIR"] } },
          ],
        },
        attributes: ["id", "personId", "movieId", "role"],
      });

      const castDB = await MoviesActors.findAll({
        where: {
          [Sequelize.Op.and]: [
            { movieId: id },
            { role: { [Sequelize.Op.contains]: ["CAST"] } },
          ],
        },
        attributes: ["id", "personId", "movieId", "role"],
      });

      const producersDB = await MoviesActors.findAll({
        where: {
          [Sequelize.Op.and]: [
            { movieId: id },
            { role: { [Sequelize.Op.contains]: ["PROD"] } },
          ],
        },
        attributes: ["id", "personId", "movieId", "role"],
      });

      const movie = await Movie.findOne({
        where: { id: id },
        attributes: ["id", "title", "year"],
      });

      let directors = await getMoviePersons(directorsDB);
      let cast = await getMoviePersons(castDB);
      let producers = await getMoviePersons(producersDB);

      const finalRes = {
        ...movie.dataValues,
        directors: directors,
        cast: cast,
        producers: producers,
      };

      return res.json(finalRes);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  /*   // HELPER FUNCTIONS
  async unwindPersonJoinTable(personId, movieId) {
    const joinTableData = await MoviesActors.findAll({
      where: { personId: personId, movieId: movieId },
    });
    console.log("t1");
    let resolvedPromises = await Promise.all(joinTableData).then((val, i) => {
      return val;
    });
    console.log(resolvedPromises, "t2");
    let finalRes = resolvedPromises[0]?.dataValues;

    return finalRes;
  },

  async getMoviePersons(persons) {
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
  }, */
};

import Helper from "../utils/index.js";

import { Sequelize } from "sequelize";
import { Person } from "../models/person.js";
import { MoviesActors } from "../models/movies_people.js";

const getPersonMovies = Helper.getPersonMovies;

export const PeopleController = {
  async getPersonById(req, res) {
    try {
      const { id } = req.params;

      const directedMoviesDB = await MoviesActors.findAll({
        where: {
          [Sequelize.Op.and]: [
            { personId: id },
            { role: { [Sequelize.Op.contains]: ["DIR"] } },
          ],
        },
        attributes: ["id", "personId", "movieId", "role"],
      });

      const castedMoviesDB = await MoviesActors.findAll({
        where: {
          [Sequelize.Op.and]: [
            { personId: id },
            { role: { [Sequelize.Op.contains]: ["CAST"] } },
          ],
        },
        attributes: ["id", "personId", "movieId", "role"],
      });

      const producedMoviesDB = await MoviesActors.findAll({
        where: {
          [Sequelize.Op.and]: [
            { personId: id },
            { role: { [Sequelize.Op.contains]: ["PROD"] } },
          ],
        },
        attributes: ["id", "personId", "movieId", "role"],
      });

      const person = await Person.findOne({
        where: { id: id },
        attributes: ["id", "name", "lastName", "age"],
      });

      let directed = await getPersonMovies(directedMoviesDB);
      let casted = await getPersonMovies(castedMoviesDB);
      let produced = await getPersonMovies(producedMoviesDB);

      const finalRes = {
        ...person.dataValues,
        directedMovies: directed,
        castedMovies: casted,
        producedMovies: produced,
      };

      return res.json(finalRes);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  async addPerson(req, res) {
    const { name, lastName, age } = req.body;

    try {
      const personCreated = await Person.create({
        name: name,
        lastName: lastName,
        age: age,
      });

      return res.json({ created: personCreated });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  async getPeople(_, res) {
    try {
      const people = await Person.findAll();

      return res.json(people);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

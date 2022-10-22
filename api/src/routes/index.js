import { Router } from "express";
import peopleRouter from "./people.js";
import moviesRouter from "./movies.js";

const router = Router();

router.use("/movies", moviesRouter);
router.use("/people", peopleRouter);
// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

/* router.post("/add/movie", async (req, res) => {
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
});
router.post("/add/person", async (req, res) => {
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
});

router.post("/add/movieToPerson", async (req, res) => {
  try {
    const { personID, movieID, role } = req.body;

    const person = await Person.findOne({ where: { id: personID } });
    const movie = await Movie.findOne({ where: { id: movieID } });

    await person.addMovies(movie, { through: { role: [role] } });

    return res.json({ updatedPerson: person });
  } catch (error) {
    return res.status(500).json(error);
  }
});
router.post("/add/personToMovie", async (req, res) => {
  try {
    const { personID, movieID, role } = req.body;
    const ARR_FOR_CONDITIONAL = ["CAST", "PROD", "DIR"];
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
});



router.get("/all", async (req, res) => {
  try {

    const people = await Person.findAll();
    const movies = await Movie.findAll();

    return res.json({ movieList: movies, peopleList: people });
  } catch (error) {
    return res.status(500).json(error);
  }
});
router.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.findAll();

    return res.json(movies);
  } catch (error) {
    return res.status(500).json(error);
  }
});
router.get("/people", async (req, res) => {
  try {
    const people = await Person.findAll({
      include: [{ model: Movie, attributes: ["id", "title", "year"] }],
    });

    return res.json(people);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// HELPER FUNCTIONS
async function unwindPersonJoinTable(personId, movieId) {
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
}

async function getMoviePersons(persons) {
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
}

async function getPersonMovies(movies) {
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
}

router.get("/people/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const directedMoviesDB = await MoviesActors.findAll({
      where: {
        [Sequelize.Op.and]: [
          { personId: id },
          { role: { [Sequelize.Op.contains]: ["DIR"] } },
        ],
      },
    });

    const castedMoviesDB = await MoviesActors.findAll({
      where: {
        [Sequelize.Op.and]: [
          { personId: id },
          { role: { [Sequelize.Op.contains]: ["CAST"] } },
        ],
      },
    });

    const producedMoviesDB = await MoviesActors.findAll({
      where: {
        [Sequelize.Op.and]: [
          { personId: id },
          { role: { [Sequelize.Op.contains]: ["PROD"] } },
        ],
      },
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
});

router.get("/movies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const directorsDB = await MoviesActors.findAll({
      where: {
        [Sequelize.Op.and]: [
          { movieId: id },
          { role: { [Sequelize.Op.contains]: ["DIR"] } },
        ],
      },
    });

    const castDB = await MoviesActors.findAll({
      where: {
        [Sequelize.Op.and]: [
          { movieId: id },
          { role: { [Sequelize.Op.contains]: ["CAST"] } },
        ],
      },
    });

    const producersDB = await MoviesActors.findAll({
      where: {
        [Sequelize.Op.and]: [
          { movieId: id },
          { role: { [Sequelize.Op.contains]: ["PROD"] } },
        ],
      },
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
}); */

export default router;

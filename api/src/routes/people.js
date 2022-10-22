import { Router } from "express";
import { PeopleController } from "../controllers/people.controller.js";

const router = Router();

// POST
router.post("/addPerson", PeopleController.addPerson);

// GET
router.get("/", PeopleController.getPeople);
router.get("/:id", PeopleController.getPersonById);

export default router;

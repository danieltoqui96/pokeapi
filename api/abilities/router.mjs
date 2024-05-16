import { Router } from "express";
import { AbilitiesController } from "./controller.mjs";

export const abilitiesRouter = Router();

abilitiesRouter.get("/", AbilitiesController.getAll);
abilitiesRouter.get("/:id", AbilitiesController.getById);
abilitiesRouter.post("/", AbilitiesController.create);
abilitiesRouter.delete("/:id", AbilitiesController.delete);
abilitiesRouter.patch("/:id", AbilitiesController.update);
abilitiesRouter.post("/createMany", AbilitiesController.createMany);

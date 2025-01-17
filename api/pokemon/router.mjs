import { Router } from "express";
import { PokemonController } from "./controller.mjs";

export const pokemonRouter = Router();

pokemonRouter.get("/", PokemonController.getAll);
pokemonRouter.get("/:id", PokemonController.getById);
pokemonRouter.post("/", PokemonController.create);
pokemonRouter.delete("/:id", PokemonController.delete);
pokemonRouter.patch("/:id", PokemonController.update);
pokemonRouter.post("/createMany", PokemonController.createMany);

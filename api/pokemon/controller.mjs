import { PokemonModel } from "./model.mjs";
import { validate, validatePartial } from "../../schemas/pokemon.mjs";
import fs from "fs";

function readJSON(patch) {
  return JSON.parse(fs.readFileSync(patch));
}

export class PokemonController {
  // Obtener todos los Pokémon
  static async getAll(req, res) {
    try {
      const allPokemon = await PokemonModel.getAll();
      res.json({
        count: allPokemon.length,
        data: allPokemon,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "Ocurrió un error al recuperar los Pokémon",
      });
    }
  }

  // Obtener Pokémon
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const pokemon = await PokemonModel.getById({ id });
      res.json({
        status: "success",
        data: pokemon,
      });
    } catch (error) {
      if (error.message === "NOT_FOUND")
        return res.status(404).json({
          status: "error",
          message: "Pokémon no encontrado",
        });
      res.status(500).json({
        status: "error",
        message: "Ocurrió un error al recuperar Pokémon",
      });
    }
  }

  // Crear Pokémon
  static async create(req, res) {
    try {
      const result = validate(req.body);
      if (!result.success) throw { message: "INVALID_DATA", result: result };
      const pokemon = await PokemonModel.create({ input: result.data });
      res.status(201).json({
        message: "Pokémon creado con éxito",
        data: pokemon,
      });
    } catch (error) {
      if (error.message === "INVALID_DATA")
        return res.status(400).json({
          status: "error",
          message: "Datos de Pokémon inválidos",
          error: JSON.parse(error.result.error),
        });
      res.status(500).json({
        status: "error",
        message: "Ocurrió un error al crear Pokémon",
      });
    }
  }

  // Eliminar Pokémon
  static async delete(req, res) {
    try {
      const { id } = req.params;
      await PokemonModel.delete({ id });
      res.json({ status: "success", message: "Pokémon eliminado" });
    } catch (error) {
      if (error.message === "NOT_FOUND")
        return res.status(404).json({
          status: "error",
          message: "Pokémon no encontrado",
        });
      res.status(500).json({
        status: "error",
        message: "Ocurrió un error al eliminar Pokémon",
      });
    }
  }

  // Actualizar Pokémon
  static async update(req, res) {
    try {
      const result = validatePartial(req.body);
      if (!result.success) throw { message: "INVALID_DATA", result: result };
      const { id } = req.params;
      await PokemonModel.update({
        id,
        input: result.data,
      });
      res.json({
        status: "success",
        message: "Pokémon actualizado con éxito",
      });
    } catch (error) {
      if (error.message === "INVALID_DATA")
        return res.status(400).json({
          status: "error",
          message: "Datos de Pokémon inválidos",
          error: JSON.parse(error.result.error),
        });
      if (error.message === "NOT_FOUND")
        return res.status(404).json({
          status: "error",
          message: "Pokémon no encontrado",
          id: error.id,
        });
      res.status(500).json({
        status: "error",
        message: "Ocurrió un error al actualizar Pokémon",
      });
    }
  }

  // Crear muchos Movimientos
  static async createMany(req, res) {
    try {
      const data = readJSON(req.body.route);
      const validated = [];
      const nonValidated = [];

      for (const pokemon of data) {
        const result = validate(pokemon);
        if (!result.success) {
          pokemon.error = result.error;
          nonValidated.push(pokemon);
        } else validated.push(result.data);
      }

      if (nonValidated.length !== 0)
        throw { message: "NON_VALIDATED", nonValidated: nonValidated };

      const inserted = await PokemonModel.createMany({
        input: validated,
      });

      res.status(201).json({
        count: data.length,
        validated: validated.length,
        inserted: inserted.length,
      });
    } catch (error) {
      if (error.message === "NON_VALIDATED")
        return res.status(400).json({
          status: "error",
          message: "Datos de Pokémon inválidos",
          nonValidated: error.nonValidated.map((pokemon) => {
            return {
              pokemon: pokemon.key,
              error: pokemon.error,
            };
          }),
        });

      res.status(500).json({
        status: "error",
        message: "Ocurrió un insertar muchos Pokémon",
        error: error,
      });
    }
  }
}

import { AbilityModel } from "./model.mjs";
import { validate, validatePartial } from "../../schemas/ability.mjs";
import fs from "fs";

function readJSON(patch) {
  return JSON.parse(fs.readFileSync(patch));
}

export class AbilitiesController {
  // Obtener todas las Habilidades
  static async getAll(req, res) {
    try {
      const abilities = await AbilityModel.getAll();
      res.json({
        count: abilities.length,
        data: abilities,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Ocurrió un error al recuperar Habilidades",
      });
    }
  }

  // Obtener Habilidad
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const ability = await AbilityModel.getById({ id });
      res.json({
        status: "success",
        data: ability,
      });
    } catch (error) {
      if (error.message === "NOT_FOUND")
        return res.status(404).json({
          status: "error",
          message: "Habilidad no encontrada",
        });
      res.status(500).json({
        status: "error",
        message: "Ocurrió un error al recuperar Habilidad",
      });
    }
  }

  // Crear Habilidad
  static async create(req, res) {
    try {
      const result = validate(req.body);
      if (!result.success) throw { message: "INVALID_DATA", result: result };
      const ability = await AbilityModel.create({ input: result.data });
      res.status(201).json({
        status: "success",
        message: "Habilidad creada con éxito",
        data: ability,
      });
    } catch (error) {
      if (error.message === "INVALID_DATA")
        return res.status(400).json({
          status: "error",
          message: "Datos de Habilidad inválidos",
          error: JSON.parse(error.result.error),
        });
      res.status(500).json({
        status: "error",
        message: "Ocurrió un error al crear Habilidad",
      });
    }
  }

  // ELiminar Habilidad
  static async delete(req, res) {
    try {
      const { id } = req.params;
      await AbilityModel.delete({ id });
      res.json({ status: "success", message: "Habilidad eliminada" });
    } catch (error) {
      if (error.message === "NOT_FOUND")
        return res.status(404).json({
          status: "error",
          message: "Habilidad no encontrada",
        });
      res.status(500).json({
        status: "error",
        message: "Ocurrió un error al eliminar Habilidad",
      });
    }
  }

  // Actualizar Habilidad
  static async update(req, res) {
    try {
      const result = validatePartial(req.body);
      if (!result.success) throw { message: "INVALID_DATA", result: result };
      const { id } = req.params;
      await AbilityModel.update({
        id,
        input: result.data,
      });
      res.json({
        status: "success",
        message: "Habilidad actualizada con éxito",
      });
    } catch (error) {
      if (error.message === "INVALID_DATA")
        return res.status(400).json({
          status: "error",
          message: "Datos de Habilidad inválidos",
          error: JSON.parse(error.result.error),
        });
      if (error.message === "NOT_FOUND")
        return res.status(404).json({
          status: "error",
          message: "Habilidad no encontrada",
        });
      res.status(500).json({
        status: "error",
        message: "Ocurrió un error al actualizar Habilidad",
      });
    }
  }

  // Crear muchas Habilidades
  static async createMany(req, res) {
    try {
      const data = readJSON(req.body.route);
      const validated = [];
      const nonValidated = [];

      for (const ability of data) {
        const result = validate(ability);
        if (!result.success) {
          ability.error = result.error;
          nonValidated.push(ability);
        } else validated.push(result.data);
      }

      if (nonValidated.length !== 0)
        throw { message: "NON_VALIDATED", nonValidated: nonValidated };

      const inserted = await AbilityModel.createMany({
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
          message: "Datos de Habilidad inválidos",
          nonValidated: error.nonValidated.map((ability) => {
            return {
              ability: ability.name_es,
              error: ability.error,
            };
          }),
        });

      res.status(500).json({
        status: "error",
        message: "Ocurrió un insertar muchas Habilidades",
      });
    }
  }
}

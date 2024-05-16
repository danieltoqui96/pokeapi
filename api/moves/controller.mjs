import { MoveModel } from "./model.mjs";
import { validate, validatePartial } from "../../schemas/move.mjs";
import fs from "fs";

function readJSON(patch) {
  return JSON.parse(fs.readFileSync(patch));
}

export class MovesController {
  // Obtener todos los Movimientos
  static async getAll(req, res) {
    try {
      const moves = await MoveModel.getAll();
      res.json({
        count: moves.length,
        data: moves,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Ocurrió un error al recuperar Movimientos",
      });
    }
  }

  // Obtener Movimiento
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const move = await MoveModel.getById({ id });
      res.json({
        status: "success",
        data: move,
      });
    } catch (error) {
      if (error.message === "NOT_FOUND")
        return res.status(404).json({
          status: "error",
          message: `Movimiento no encontrado`,
        });
      res.status(500).json({
        status: "error",
        message: "Ocurrió un error al recuperar Movimiento",
      });
    }
  }

  // Crear Movimiento
  static async create(req, res) {
    try {
      const result = validate(req.body);
      if (!result.success) throw { message: "INVALID_DATA", result: result };
      const move = await MoveModel.create({ input: result.data });
      res.status(201).json({
        status: "success",
        message: "Movimiento creado con éxito",
        data: move,
      });
    } catch (error) {
      if (error.message === "INVALID_DATA")
        return res.status(400).json({
          status: "error",
          message: "Datos de Movimiento inválidos",
          error: JSON.parse(error.result.error),
        });
      res.status(500).json({
        status: "error",
        message: "Ocurrió un error al crear Movimiento",
      });
    }
  }

  // Eliminar Movimiento
  static async delete(req, res) {
    try {
      const { id } = req.params;
      await MoveModel.delete({ id });
      res.json({ status: "success", message: "Movimiento eliminado" });
    } catch (error) {
      if (error.message === "NOT_FOUND")
        return res.status(404).json({
          status: "error",
          message: "Movimiento no encontrado",
        });
      res.status(500).json({
        status: "error",
        message: "Ocurrió un error al eliminar Habilidad",
      });
    }
  }

  // Actualizar Movimiento
  static async update(req, res) {
    try {
      const result = validatePartial(req.body);
      if (!result.success) throw { message: "INVALID_DATA", result: result };
      const { id } = req.params;
      await MoveModel.update({
        id,
        input: result.data,
      });
      res.json({
        status: "success",
        message: "Movimiento actualizado con éxito",
      });
    } catch (error) {
      if (error.message === "INVALID_DATA")
        return res.status(400).json({
          status: "error",
          message: "Datos de Movimiento inválidos",
          error: JSON.parse(error.result.error),
        });
      if (error.message === "NOT_FOUND")
        return res.status(404).json({
          status: "error",
          message: "Movimiento no encontrado",
        });
      res.status(500).json({
        status: "error",
        message: "Ocurrió un error al actualizar Movimiento",
      });
    }
  }

  // Crear muchos Movimientos
  static async createMany(req, res) {
    try {
      const data = readJSON(req.body.route);
      const validated = [];
      const nonValidated = [];

      for (const move of data) {
        const result = validate(move);
        if (!result.success) {
          move.error = result.error;
          nonValidated.push(move);
        } else validated.push(result.data);
      }

      if (nonValidated.length !== 0)
        throw { message: "NON_VALIDATED", nonValidated: nonValidated };

      const inserted = await MoveModel.createMany({
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
          message: "Datos de Movimiento inválidos",
          nonValidated: error.nonValidated.map((move) => {
            return {
              move: move.name_es,
              error: move.error,
            };
          }),
        });

      res.status(500).json({
        status: "error",
        message: "Ocurrió un insertar muchos Movimientos",
      });
    }
  }
}

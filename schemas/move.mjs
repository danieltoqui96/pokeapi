import z from "zod";
import { types, moveClasses } from "../utils/constants.mjs";

const moveSchema = z.object({
  name_es: z.string(),
  name_en: z.string(),
  type: z.enum(types),
  class: z.enum(moveClasses),
  power: z.number().nullable(),
  pp: z.number(),
  accuracy: z.number().nullable(),
  info: z.string(),
});

export function validate(input) {
  return moveSchema.safeParse(input);
}

export function validatePartial(input) {
  return moveSchema.partial().safeParse(input);
}

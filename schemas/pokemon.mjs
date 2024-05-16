import z from "zod";

import { generations, types } from "../utils/constants.mjs";

const pokemonSchema = z.object({
  key: z.string(),
  name: z.string(),
  form: z.string().nullable(),
  number: z.number(),
  gen: z.enum(generations),
  img: z.string().url().endsWith(".png"),
  types: z.array(z.enum(types)),
  abilities: z.object({
    first: z.string(),
    second: z.string().nullable(),
    hidden: z.string().nullable(),
  }),
  stats: z.array(z.number()),
});

export function validate(input) {
  return pokemonSchema.safeParse(input);
}

export function validatePartial(input) {
  return pokemonSchema.partial().safeParse(input);
}

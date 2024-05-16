import z from "zod";

const abilitySchema = z.object({
  name_es: z.string(),
  name_en: z.string(),
  info: z.string(),
});

export function validate(input) {
  return abilitySchema.safeParse(input);
}

export function validatePartial(input) {
  return abilitySchema.partial().safeParse(input);
}

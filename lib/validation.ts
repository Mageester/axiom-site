import { z } from "zod";

const controlChars = /^[=+\-@\t\r]/;

const sanitizeField = (value: string) =>
  value
    .replace(/\0/g, "")
    .replace(controlChars, "'$&")
    .trim();

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(180),
  company: z.string().max(180).optional().default(""),
  message: z.string().min(10).max(4000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const normalizeContact = (input: ContactInput): ContactInput => ({
  name: sanitizeField(input.name),
  email: sanitizeField(input.email).toLowerCase(),
  company: sanitizeField(input.company || ""),
  message: sanitizeField(input.message),
});

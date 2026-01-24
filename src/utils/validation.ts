import { z } from 'zod';

/**
 * Validation schema for note form
 */
export const noteSchema = z.object({
  title: z
    .string()
    .min(1, 'Başlık zorunludur')
    .max(100, 'Başlık en fazla 100 karakter olabilir'),
  content: z.string().default(''),
  tags: z.array(z.string()).default([]),
});

/**
 * Validation schema for tag form
 */
export const tagSchema = z.object({
  name: z
    .string()
    .min(1, 'Tag adı zorunludur')
    .max(30, 'Tag adı en fazla 30 karakter olabilir'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Geçerli bir renk seçiniz'),
});

/**
 * Type inference from schemas
 */
export type NoteSchemaType = z.infer<typeof noteSchema>;
export type TagSchemaType = z.infer<typeof tagSchema>;

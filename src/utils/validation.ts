import { z } from 'zod';

/**
 * Validation schema for note form
 */
export const noteSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title can be at most 100 characters'),
  content: z.string().default(''),
  tags: z.array(z.string()).default([]),
});

/**
 * Validation schema for tag form
 */
export const tagSchema = z.object({
  name: z
    .string()
    .min(1, 'Tag name is required')
    .max(30, 'Tag name can be at most 30 characters'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Please select a valid color'),
});

/**
 * Type inference from schemas
 */
export type NoteSchemaType = z.infer<typeof noteSchema>;
export type TagSchemaType = z.infer<typeof tagSchema>;

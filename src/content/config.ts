import { defineCollection, z } from 'astro:content';

// Servicios collection schema
const serviciosCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(), // SVG string
    category: z.enum(['ginecologico', 'obstetrico']),
    order: z.number(),
  }),
});

// Equipo (Team) collection schema
const equipoCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    specialty: z.string(),
    image: z.string(), // Path to image
    bio: z.string().optional(),
    order: z.number(),
  }),
});

// Export collections
export const collections = {
  servicios: serviciosCollection,
  equipo: equipoCollection,
};


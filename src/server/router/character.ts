import { createRouter } from './context';
import { z } from 'zod';

export const characterRouter = createRouter()
	.mutation('createCharacter', {
		input: z
			.object({
				name: z.string(),
				age: z.number(),
				race: z.string(),
			}),
		async resolve({ ctx, input }) {
			return await ctx.prisma.character.create({
				data: {
					...input,
					createdAt: new Date(),
				},
			});
		},
	})
	.query('getAll', {
		async resolve({ ctx }) {
			return await ctx.prisma.character.findMany({
				orderBy: {
					createdAt: 'desc',
				},
			});
		},
	})
	.mutation('deleteCharacter', {
		input: z.object({
			id: z.string(),
		}),
		async resolve({ ctx, input }) {
			return await ctx.prisma.character.delete({
				where: {
					id: input.id,
				},
			});
		},
	});
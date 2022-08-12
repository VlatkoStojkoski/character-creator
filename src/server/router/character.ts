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
	.mutation('getAll', {
		input: z.object({
			page: z.number(),
		}),
		async resolve({ ctx, input }) {
			const pageSize = 5;

			return await ctx.prisma.character.findMany({
				orderBy: {
					createdAt: 'desc',
				},
				skip: pageSize * input.page,
				take: pageSize,
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
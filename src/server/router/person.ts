import { createRouter } from './context';
import { z } from 'zod';

export const personRouter = createRouter()
	.mutation('createPerson', {
		input: z
			.object({
				name: z.string(),
				age: z.number(),
				race: z.enum(['white', 'black', 'yellow']),
			}),
		async resolve({ ctx, input }) {
			return await ctx.prisma.person.create({
				data: {
					...input,
					createdAt: new Date(),
				},
			});
		},
	})
	.query('getAll', {
		async resolve({ ctx }) {
			return await ctx.prisma.person.findMany({
				orderBy: {
					createdAt: 'desc',
				},
			});
		},
	})
	.mutation('deletePerson', {
		input: z.object({
			id: z.string(),
		}),
		async resolve({ ctx, input }) {
			return await ctx.prisma.person.delete({
				where: {
					id: input.id,
				},
			});
		},
	});
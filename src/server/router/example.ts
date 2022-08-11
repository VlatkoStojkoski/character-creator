import { createRouter } from './context';
import { z } from 'zod';

const raceResponses = {
	'white': 'Good afternoon!',
	'black': 'Ayo what\'s up ni🅱️🅱️a!',
	'yellow': 'Ching chong!',
};

export const exampleRouter = createRouter()
	.query('hello', {
		input: z
			.object({
				text: z.string().nullish().optional(),
				person: z.object({
					name: z.string(),
					age: z.number(),
					race: z.enum(['white', 'black', 'yellow']),
				}).optional(),
			})
			.nullish(),
		resolve({ input }) {
			return input?.person ? {
				greeting: `${raceResponses[input.person.race]} Hope you have a good time here at FinSim ${input.person.name}!`,
			} : {
				greeting: `Hello ${input?.text ?? 'world'}`,
			};
		},
	})
	.query('getAll', {
		async resolve({ ctx }) {
			return await ctx.prisma.example.findMany();
		},
	});
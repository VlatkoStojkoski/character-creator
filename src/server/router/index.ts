// src/server/router/index.ts
import { createRouter } from './context';
import superjson from 'superjson';

import { exampleRouter } from './example';
import { protectedExampleRouter } from './protected-example-router';
import { personRouter } from './person';

export const appRouter = createRouter()
	.transformer(superjson)
	.merge('example.', exampleRouter)
	.merge('question.', protectedExampleRouter)
	.merge('person.', personRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

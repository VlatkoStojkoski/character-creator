// src/server/router/index.ts
import { createRouter } from './context';
import superjson from 'superjson';

import { protectedExampleRouter } from './protected-example-router';
import { characterRouter } from './character';

export const appRouter = createRouter()
	.transformer(superjson)
	.merge('question.', protectedExampleRouter)
	.merge('character.', characterRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

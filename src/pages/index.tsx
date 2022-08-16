import { useEffect, useState } from 'react';
import { InferGetServerSidePropsType } from 'next';
import type { NextPage } from 'next';
import Head from 'next/head';
import { characterRaces, trpc } from '../utils/trpc';
import type { ArrayElement, inferQueryOutput } from '../utils/trpc';
import Characters from '../components/Characters';
import { firstUppercase } from '../utils';
import { flushSync } from 'react-dom';

export const getCharactersMutationFunction = () => trpc.useMutation(['character.getAll']);

const Home: NextPage = () => {
	const [name, setName] = useState<string>('');
	const [age, setAge] = useState<number>(0);
	const [race, setRace] = useState<string>('human');
	const [page, setPage] = useState<number>(0);

	const charactersMutation = getCharactersMutationFunction();

	useEffect(() => {
		charactersMutation.mutate({ page });
	}, []);

	const nextPage = () => {
		const newPage = page + 1;
		setPage(newPage);
		charactersMutation.mutate({ page: newPage });
	};

	const prevPage = () => {
		const newPage = Math.max(0, page - 1);
		setPage(newPage);
		charactersMutation.mutate({ page: newPage });
	};

	const {
		isLoading: isCreateCharacterLoading,
		mutate: createCharacter,
	} = trpc.useMutation(['character.createCharacter'], {
		onSuccess(data) {
			charactersMutation.mutate({ page });
			console.log('character created successfully', data);
		},
		onError(error) {
			console.error(error);
		},
	});

	return (
		<>
			<Head>
				<title>Character creator</title>
				<meta name="description" content="Fantasy character creator made using the T3 tech stack" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main style={{ padding: '1em', width: 'fit-content', margin: '0 auto' }}>
				<h1>
					Fantasy character creator
				</h1>
				<span>{isCreateCharacterLoading}</span>

				<div style={{
					display: 'flex',
					flexDirection: 'column',
					rowGap: '0.1em',
				}}>
					<label>
						Name:{' '}
						<input type="string" value={name} onChange={(e) => {
							setName(e.currentTarget.value);
						}} />
					</label>

					<br />

					<label>
						Age:{' '}
						<input type="number" min={0} value={age} onChange={(e) => {
							setAge(+e.currentTarget.value);
						}} />
					</label>

					<br />

					<label>
						Race:{' '}
						<select value={race} onChange={(e) => {
							setRace(e.currentTarget.value);
						}}>
							{characterRaces.map((race, raceI) =>
								<option key={raceI} value={race}>{firstUppercase(race)}</option>
							)}
						</select>
					</label>

					<br />

					<button style={{ margin: '0.5em 0', fontSize: '1em' }} onClick={() => {
						createCharacter({
							name,
							age,
							race,
						});
					}}>Save character</button>

					<Characters
						mutation={charactersMutation}
						page={page}
					/>

					<div style={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						columnGap: '1em',
					}}>
						<button onClick={prevPage}>{'<-'}</button>
						<button onClick={nextPage}>{'->'}</button>
					</div>
				</div>
			</main>
		</>
	);
};

export default Home;
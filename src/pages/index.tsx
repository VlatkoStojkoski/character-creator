import { useEffect, useState } from 'react';
import { InferGetServerSidePropsType } from 'next';
import type { NextPage } from 'next';
import Head from 'next/head';
import { characterRaces, trpc } from '../utils/trpc';
import type { ArrayElement, inferQueryOutput } from '../utils/trpc';
import Characters from '../components/Characters';
import { firstUppercase } from '../utils';

export const getCharactersQueryFunction = () => trpc.useQuery(['character.getAll'], {
	refetchInterval: 3000,
});

const Home: NextPage = () => {
	const [name, setName] = useState<string>('');
	const [age, setAge] = useState<number>(0);
	const [race, setRace] = useState<string>('human');

	const getCharactersQuery = getCharactersQueryFunction();

	const {
		isLoading: isCreateCharacterLoading,
		mutate: createCharacter,
	} = trpc.useMutation(['character.createCharacter'], {
		onSuccess(data) {
			getCharactersQuery.refetch();
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

			<main style={{ padding: '1em' }}>
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

					<button style={{ margin: '0.5em 0' }} onClick={() => {
						createCharacter({
							name,
							age,
							race,
						});
					}}>Save character</button>

					<Characters
						query={getCharactersQuery}
					/>
				</div>
			</main>
		</>
	);
};

export default Home;
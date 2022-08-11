import { useEffect, useState } from 'react';
import { InferGetServerSidePropsType } from 'next';
import type { NextPage } from 'next';
import Head from 'next/head';
import { trpc } from '../utils/trpc';
import People from '../components/People';

export const getPeopleQueryFunction = () => trpc.useQuery(['person.getAll'], {
	refetchInterval: 3000,
});

const Home: NextPage = () => {
	const [name, setName] = useState<string>('');
	const [age, setAge] = useState<number>(0);
	const [race, setRace] = useState<'white' | 'black' | 'yellow'>('white');

	const getPeopleQuery = getPeopleQueryFunction();

	const {
		isLoading: isCreatePersonLoading,
		mutate: createPerson,
	} = trpc.useMutation(['person.createPerson'], {
		onSuccess(data) {
			getPeopleQuery.refetch();
			console.log('Person created successfully', data);
		},
		onError(error) {
			console.error(error);
		},
	});

	return (
		<>
			<Head>
				<title>T3 app example</title>
				<meta name="description" content="My first look into the T3 stack" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div>
				<h1>
					Racial Profiling App
				</h1>
				<span>{isCreatePersonLoading}</span>

				<div>
					<label>
						Name:
						<input type="string" value={name} onChange={(e) => {
							setName(e.currentTarget.value);
						}} />
					</label>

					<br />

					<label>
						Age:
						<input type="number" min={0} value={age} onChange={(e) => {
							setAge(+e.currentTarget.value);
						}} />
					</label>

					<br />

					<label>
						Race:
						<select value={race} onChange={(e) => {
							setRace(e.currentTarget.value as 'white' | 'black' | 'yellow');
						}}>
							<option value="white">White</option>
							<option value="black">Black</option>
							<option value="yellow">Yellow</option>
						</select>
					</label>

					<br />

					<button onClick={() => {
						createPerson({
							name,
							age,
							race,
						});
					}}>Save character</button>

					<People
						query={getPeopleQuery}
					/>
				</div>
			</div>
		</>
	);
};

export default Home;
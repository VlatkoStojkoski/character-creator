import React, { useEffect, useState } from 'react';
import uniqolor from 'uniqolor';
import { trpc } from '../utils/trpc';

const People: React.FC = (props) => {
	const { data: people, isLoading, refetch } = trpc.useQuery(['person.getAll'], {
		refetchInterval: 3000,
	});

	const { isLoading: isDeletePostLoading, mutate: deletePerson } = trpc.useMutation(['person.deletePerson'], {
		onSuccess(data) {
			refetch();
			console.log('Person deleted successfully', data);
		},
		onError(error) {
			console.error(error);
		},
	});

	if (!people) {
		return <h2>Loading...</h2>;
	}

	return (
		<code>
			{people.map((person) =>
				<div key={person.id} style={{
					marginBottom: '1em',
					color: uniqolor(person.id, {
						lightness: [30, 40],
					}).color,
				}}>
					<i>{person.id}</i>
					<br />
					Name: {person.name}
					<br />
					Age: {person.age}
					<br />
					Race: {person.race}
					<br />
					<a href="#" onClick={() => {
						deletePerson({
							id: person.id,
						});
					}} style={{
						color: 'red',
					}}>Delete</a>
				</div>
			)}
		</code>
	);
};

export default People;

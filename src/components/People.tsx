import React, { useEffect, useState } from 'react';
import uniqolor from 'uniqolor';
import { getPeopleQueryFunction } from '../pages';
import { inferQueryOutput, QueryReturn, trpc } from '../utils/trpc';

interface PeopleProps {
	query: ReturnType<typeof getPeopleQueryFunction>
}

const People: React.FC<PeopleProps> = ({
	query: {
		data: people,
		isLoading: isGetPeopleLoading,
		refetch: refetchGetPeople,
	},
}) => {
	const [deleted, setDeleted] = useState<{ [id: string]: true }>({});

	const {
		isLoading: isDeletePersonLoading,
		mutate: deletePerson,
	} = trpc.useMutation(['person.deletePerson'], {
		onSuccess(data) {
			refetchGetPeople();
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
				!deleted[person.id] &&
				<div key={person.id} style={{
					marginBottom: '1em',
					color: uniqolor(person.age, {
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
						if (isDeletePersonLoading) return;

						deletePerson({
							id: person.id,
						});

						deleted[person.id] = true;
					}} style={{
						color: 'red',
					}}>Delete</a>
				</div>
			)}
		</code>
	);
};

export default People;

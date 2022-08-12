import React, { useEffect, useState } from 'react';
import uniqolor from 'uniqolor';
import { getCharactersMutationFunction } from '../pages';
import { inferQueryOutput, QueryReturn, trpc } from '../utils/trpc';

interface charactersProps {
	mutation: ReturnType<typeof getCharactersMutationFunction>;
	page: number;
}

const Characters: React.FC<charactersProps> = ({
	mutation: {
		data: characters,
		isLoading: isGetCharactersLoading,
		mutate: mutateGetCharacters,
	},
	page,
}) => {
	const [deleted, setDeleted] = useState<{ [id: string]: true }>({});

	const {
		isLoading: isdeleteCharacterLoading,
		mutate: deleteCharacter,
	} = trpc.useMutation(['character.deleteCharacter'], {
		onSuccess(data) {
			mutateGetCharacters({ page });
			console.log('character deleted successfully', data);
		},
		onError(error) {
			console.error(error);
		},
	});

	return (
		<code style={{
			height: '500px',
			overflowY: 'auto',
		}}>
			<h2>Characters:</h2>
			{!characters ? <h3 style={{ fontWeight: 'normal' }}>Loading...</h3> :
				characters.map((character) =>
					!deleted[character.id] &&
					<div key={character.id} style={{
						marginBottom: '1em',
						color: uniqolor(character.race, {
							lightness: [30, 40],
						}).color,
					}}>
						<i>{character.id}</i>
						<br />
						Name: {character.name}
						<br />
						Age: {character.age}
						<br />
						Race: {character.race}
						<br />
						<a href="#" onClick={() => {
							if (isdeleteCharacterLoading) return;

							deleteCharacter({
								id: character.id,
							});

							setDeleted({ ...deleted, [character.id]: true });
						}} style={{
							color: 'red',
						}}>Delete</a>
					</div>
				)}
		</code>
	);
};

export default Characters;

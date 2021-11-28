import './DisplayPollForCreator.css';
import { useEffect, useState } from 'react';
import { Poll } from '../App/utils';
import { useSocket } from '../../providers/Socket';

interface DisplayPollForCreatorProps {
	poll: Poll;
	pollID: string;
}

export const DisplayPollForCreator = ({
	poll,
	pollID,
}: DisplayPollForCreatorProps) => {
	const { socket } = useSocket();
	const [votes, setVotes] = useState<
		{ option: string; numOfVotes: number; id: string }[]
	>(poll.votes);

	useEffect(() => {
		if (socket === null) return;
		socket.on('client-vote', (data) => {
			const _data = JSON.parse(data);
			if (_data.poll.votes !== undefined && _data.poll.done !== undefined) {
				setVotes(_data.poll.votes);
			}
		});
		return () => {
			socket.off('client-vote');
		};
	});

	return (
		<div className="DisplayPollForCreator-container">
			<h2>{poll.title}</h2>
			<h3>poll ID: {pollID}</h3>
			<ul className="votes-list">
				{votes.map((vote) => (
					<li key={vote.id} className="vote-container">
						<strong className="vote-container__option">{vote.option}</strong>
						<span className="vote-container__num-of-votes">
							{vote.numOfVotes}
						</span>
					</li>
				))}
			</ul>
			{poll.timer}
		</div>
	);
};

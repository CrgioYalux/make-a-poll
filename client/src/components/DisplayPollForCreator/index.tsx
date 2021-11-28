import './DisplayPollForCreator.css';
import { useEffect, useState } from 'react';
import { Poll } from '../App/utils';
import { useSocket } from '../../providers/Socket';
import { useCountdown } from '../../hooks/useTime';
import { formatTime } from '../../hooks/useTime/utils';
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
	const { countdown, isCountdownRunning, startCountdown } = useCountdown({
		from: poll.timer ? poll.timer : { minutes: 0, seconds: 0 },
		to: { minutes: 0, seconds: 0 },
		autostart: false,
	});

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

	useEffect(() => {
		if (isCountdownRunning === false && poll.timer !== false) endPoll();
	}, [isCountdownRunning]);

	const endPoll = () => {
		if (socket === null) return;
		socket.emit('poll-ended');
	};

	return (
		<div className="DisplayPollForCreator-container">
			<div className="poll-info">
				<h2 className="poll-info__title">{poll.title}</h2>
				<span className="poll-info__id--container">
					Poll ID: <strong>{pollID}</strong>
				</span>
			</div>

			<div className="timer-container">
				<strong className="timer-container__time-displayer">
					{formatTime(countdown)}
				</strong>
				<div className="timer-container__controllers">
					{poll.timer !== false && (
						<button
							onClick={() => startCountdown()}
							disabled={isCountdownRunning}
						>
							Start poll
						</button>
					)}
					<button onClick={() => endPoll()}>End poll</button>
				</div>
			</div>

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
		</div>
	);
};

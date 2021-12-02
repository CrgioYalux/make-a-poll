import './DisplayPollForCreator.css';
import { EventHandler, SyntheticEvent, useEffect, useState } from 'react';
import { Poll } from '../App/utils';
import { useSocket } from '../../providers/Socket';
import { useCountdown } from '../../hooks/useTime';
import { formatTime } from '../../hooks/useTime/utils';
import { copyToClipboard } from './utils';
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
	const [endPollBTVisibility, setEndPollBTVisibility] =
		useState<boolean>(false);

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

	const handleClickCopyURL = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		const button = e.currentTarget;
		button.classList.add('--copy-url-anim');
		setTimeout(() => {
			button.classList.remove('--copy-url-anim');
		}, 400);
		const url = window.location;
		copyToClipboard(`${url.origin}/?pollID=${pollID}`);
	};

	return (
		<div className="DisplayPollForCreator-container">
			<div className="poll-info">
				<h2 className="poll-info__title">{poll.title}</h2>
				<button
					className="poll-info__copy-url-bt"
					arial-label="copy url"
					title="copy url"
					onClick={handleClickCopyURL}
				>
					copy url <span>{pollID}</span>
				</button>
			</div>

			<div className="timer-container">
				{poll.timer !== false && (
					<strong className="timer-container__time-displayer">
						{formatTime(countdown)}
					</strong>
				)}
				<div className="timer-container__controllers">
					{poll.timer !== false && (
						<button
							className="timer-container__bt timer-container__start-poll-bt"
							onClick={() => startCountdown()}
							disabled={isCountdownRunning}
						>
							Start poll
						</button>
					)}
					<form
						className="timer-container__bt timer-container__end-poll-bt"
						onSubmit={(e) => {
							e.preventDefault();
							endPoll();
							setEndPollBTVisibility((prev) => !prev);
						}}
					>
						<input
							type="checkbox"
							name="end-poll-bt"
							id="end-poll-bt"
							checked={endPollBTVisibility}
							onChange={() => setEndPollBTVisibility((prev) => !prev)}
						/>
						<label htmlFor="end-poll-bt" className="end-poll-bt__controllers">
							{endPollBTVisibility ? (
								<>
									<button className="end-poll-controllers__bt" type="submit">
										yes
									</button>
									<button
										type="button"
										className="end-poll-controllers__bt"
										onClick={() => setEndPollBTVisibility((prev) => !prev)}
									>
										no
									</button>
								</>
							) : (
								<span>End poll</span>
							)}
						</label>
					</form>
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

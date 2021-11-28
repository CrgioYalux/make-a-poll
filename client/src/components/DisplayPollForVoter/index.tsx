import './DisplayPollForVoter.css';
import { Poll } from '../App/utils';
import { useState, useEffect, SyntheticEvent } from 'react';
import { useSocket } from '../../providers/Socket';

interface DisplayPollProps {
	poll: Poll;
}

enum VotingProcessState {
	Error_AlreadyVoted = 'ERROR_ALREADYVOTED',
	Error_PollNotFound = 'ERROR_POLLNOTFOUND',
	Error_PollEnded = 'ERROR_POLLENDED',
	Error_BadRequest = 'ERROR_BADREQUEST',
	SuccessfullyVoted = 'SUCCESSFULLYVOTED',
}

export const DisplayPollForVoter = ({ poll }: DisplayPollProps) => {
	const [optionSelected, setOptionSelected] = useState<string>('');
	const [voteState, setVoteState] = useState<VotingProcessState | null>(null);
	const { socket } = useSocket();

	useEffect(() => {
		if (socket === null) return;
		socket.on('vote-state', (data) => {
			const _data = JSON.parse(data);
			if (_data.votingState) {
				setVoteState(_data.votingState);
			} else {
				setVoteState(VotingProcessState.Error_BadRequest);
			}
		});
		return () => {
			socket.off('vote-state');
		};
	});

	const vote = () => {
		const vote = poll.votes.find(({ option }) => option === optionSelected);
		if (socket && vote) {
			const data = {
				vote: {
					id: vote.id,
				},
			};
			socket.emit('client-vote', JSON.stringify(data));
		}
	};

	const handleSubmit = (event: SyntheticEvent) => {
		event.preventDefault();
		if (optionSelected) vote();
	};

	return (
		<>
			{voteState === null && (
				<div className="DisplayPoll-container _not_voted">
					<h2>{poll.title}</h2>
					<form className="voting-form" onSubmit={handleSubmit}>
						<div className="vote-options-list">
							{poll.votes.map(({ id, option }) => (
								<label
									key={id}
									htmlFor={`vote_option_${id}`}
									className="vote-option"
								>
									<span className="vote-option-text">{option}</span>
									<input
										name="vote_option"
										type="radio"
										id={`vote_option_${id}`}
										className="select-option-bt"
										value={option}
										onChange={() => setOptionSelected(option)}
									/>
								</label>
							))}
						</div>
						<button
							type="submit"
							className="submit-option-bt"
							disabled={!optionSelected}
						>
							vote
						</button>
					</form>
				</div>
			)}
			{voteState === VotingProcessState.SuccessfullyVoted && (
				<div className="DisplayPoll-container _voted">
					<h2>Successfully Voted!</h2>
					<h3>
						The results will be displayed when the poll goes off or when the
						poll's creator ends it
					</h3>
				</div>
			)}
			{voteState === VotingProcessState.Error_AlreadyVoted && (
				<div className="DisplayPoll-container _error">
					<h2>An error has occurred</h2>
					<h3>reason: you already voted</h3>
				</div>
			)}
			{voteState === VotingProcessState.Error_PollEnded && (
				<div className="DisplayPoll-container _error">
					<h2>An error has occurred</h2>
					<h3>reason: poll ended</h3>
				</div>
			)}
			{voteState === VotingProcessState.Error_PollNotFound && (
				<div className="DisplayPoll-container _error">
					<h2>An error has occurred</h2>
					<h3>reason: poll not found</h3>
				</div>
			)}
			{voteState === VotingProcessState.Error_BadRequest && (
				<div className="DisplayPoll-container _error">
					<h2>An error has occurred</h2>
					<h3>reason: bad request</h3>
				</div>
			)}
		</>
	);
};

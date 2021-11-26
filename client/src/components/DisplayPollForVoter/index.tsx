import './DisplayPollForVoter.css';
import { Poll } from '../App/utils';
import { useState, SyntheticEvent } from 'react';

interface DisplayPollProps {
	poll: Poll;
}

export const DisplayPollForVoter = ({ poll }: DisplayPollProps) => {
	const [votes, setVotes] = useState<Map<string, number>>(() => {
		const _votes = new Map<string, number>();
		poll.votes.map(({ option }) => {
			_votes.set(option, 0);
		});
		return _votes;
	});
	const [optionSelected, setOptionSelected] = useState<string>('');
	const [voted, setVoted] = useState<boolean>(false);

	const vote = (option: string) => {
		const numOfVotesForOption = votes.get(option);
		if (numOfVotesForOption !== undefined) {
			setVotes((prev) => {
				const _votes = prev;
				_votes.set(option, numOfVotesForOption + 1);
				return new Map(_votes);
			});
		}
	};

	const handleSubmit = (event: SyntheticEvent) => {
		event.preventDefault();
		if (optionSelected) {
			vote(optionSelected);
			setVoted(true);
		}
	};

	if (!voted) {
		return (
			<div className="DisplayPoll-container _no_voted">
				<h2>{poll.title}</h2>
				{/* timer here */}
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
		);
	} else {
		return (
			<div className="DisplayPoll-container _voted">
				{/* timer here */}
				<div className="voted-message">
					<h2>Voted!</h2>
					<h3>See the results when the timer goes off.</h3>
				</div>
			</div>
		);
	}
};

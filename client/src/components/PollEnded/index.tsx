import './PollEnded.css';
import { Poll } from '../App/utils';

interface PollEndedProps {
	poll: Poll;
}

let maxNumOfVotes = 0;
let winnerOption = 'no-option-voted';

export const PollEnded = ({ poll }: PollEndedProps) => {
	for (const vote of poll.votes) {
		if (vote.numOfVotes > maxNumOfVotes) {
			maxNumOfVotes = vote.numOfVotes;
			winnerOption = vote.option;
		}
	}

	return (
		<div className="PollEnded-container">
			<h2>Poll ended!</h2>
			<div>
				<h3>
					For the poll <strong>{poll.title}</strong>
				</h3>
				<h3>
					the winner option is <strong>{winnerOption}</strong>
				</h3>
				<h3>
					with <strong>{maxNumOfVotes}</strong> votes.
				</h3>
			</div>
		</div>
	);
};

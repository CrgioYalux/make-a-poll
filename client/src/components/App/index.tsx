import './App.css';
import { useState } from 'react';
import { TypeOfClient } from './utils';
import { PollCreatorMode } from '../PollCreatorMode';
import { PollVoterMode } from '../PollVoterMode';

export const App = () => {
	const [clientMode, setClientMode] = useState<TypeOfClient>(
		TypeOfClient.NotSet,
	);
	if (clientMode === TypeOfClient.NotSet) {
		return (
			<div className="App _client_not_set">
				<h2>make-a-poll</h2>
				<div className="client-options">
					<button
						className="select-clientmode-bt"
						onClick={() => setClientMode(TypeOfClient.Creator)}
					>
						Create a Poll
					</button>
					<button
						className="select-clientmode-bt"
						onClick={() => setClientMode(TypeOfClient.Voter)}
					>
						Vote
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="App">
			{clientMode === TypeOfClient.Creator && <PollCreatorMode />}
			{clientMode === TypeOfClient.Voter && <PollVoterMode />}
		</div>
	);
};

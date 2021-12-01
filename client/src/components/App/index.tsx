import './App.css';
import { useState, useEffect } from 'react';
import { TypeOfClient } from './utils';
import { PollCreatorMode } from '../PollCreatorMode';
import { PollVoterMode } from '../PollVoterMode';

export const App = () => {
	const [clientMode, setClientMode] = useState<TypeOfClient>(
		TypeOfClient.NotSet,
	);
	const [pollID, setPollID] = useState<string>('');

	useEffect(() => {
		const queryString = window.location.search;
		const params = new URLSearchParams(queryString);
		const _pollID = params.get('pollID');
		if (_pollID) {
			setPollID(_pollID);
			setClientMode(TypeOfClient.Voter);
		}
	}, []);

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
			{clientMode === TypeOfClient.Voter && <PollVoterMode pollID={pollID} />}
		</div>
	);
};

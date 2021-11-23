import './App.css';
import { CreatePoll } from '../CreatePoll';
import { useState } from 'react';
import { Poll, TypeOfClient } from './utils';
import { DisplayPollForVoter } from '../DisplayPollForVoter';
import { ClientProvider } from '../../providers/Client';

const mockPoll = {
	title: 'is this a mock poll?',
	options: [
		{ text: 'yes', id: 'yes' },
		{ text: 'no', id: 'no' },
	],
	timer: null,
};

export const App = () => {
	const [poll, setPoll] = useState<Poll | null>(null);
	const [clientMode, setClientMode] = useState<TypeOfClient>(
		TypeOfClient.Creator,
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
			<ClientProvider typeOfClient={clientMode}>
				{!poll ? (
					<CreatePoll setPoll={setPoll} />
				) : (
					<DisplayPollForVoter poll={poll} />
				)}
			</ClientProvider>
		</div>
	);
};

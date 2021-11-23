import './App.css';
import { CreatePoll } from '../CreatePoll';
import { useState } from 'react';
import { Poll } from './utils';
import { DisplayPollForVoter } from '../DisplayPollForVoter';

const mockPoll = {
	title: 'is this a mock poll?',
	options: [
		{ text: 'yes', id: 'yes' },
		{ text: 'no', id: 'no' },
	],
};

export const App = () => {
	const [poll, setPoll] = useState<Poll | null>(mockPoll);
	return (
		<div className="App">
			{!poll ? (
				<CreatePoll setPoll={setPoll} />
			) : (
				<DisplayPollForVoter poll={poll} />
			)}
		</div>
	);
};

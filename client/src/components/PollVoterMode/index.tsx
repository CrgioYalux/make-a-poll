import './PollVoterMode.css';
import { useState, useEffect } from 'react';
import { Poll } from '../App/utils';
import { DisplayPollForVoter } from '../DisplayPollForVoter';
import { SocketProvider } from '../../providers/Socket';
import { getPollByID } from './utils';

interface PollVoterModeProps {
	pollID: string;
}

enum FetchState {
	Loading = 'LOADING',
	Error = 'Error',
	Successful = 'SUCCESSFUL',
	NotStarted = 'NOTSTARTED',
}

const mockPoll: Poll = {
	title: 'is this a mock poll?',
	votes: [
		{
			option: 'yes',
			numOfVotes: 0,
			id: 'yes',
		},
		{
			option: 'no',
			numOfVotes: 2,
			id: 'no',
		},
	],
	timer: false,
	done: false,
};

export const PollVoterMode = ({ pollID }: PollVoterModeProps) => {
	const [poll, setPoll] = useState<Poll | null>(null);
	const [fetchState, setFetchState] = useState<FetchState>(
		FetchState.NotStarted,
	);

	useEffect(() => {
		setFetchState(FetchState.Loading);
		getPollByID(pollID)
			.then((response) => {
				if (response.data.poll) {
					setPoll(response.data.poll);
					setFetchState(FetchState.Successful);
				}
			})
			.catch(() => {
				setFetchState(FetchState.Error);
			});
	}, [pollID]);

	return !poll ? (
		<span style={{ color: 'white' }}>loading...</span>
	) : (
		<SocketProvider pollID={pollID} path="/socket/">
			<DisplayPollForVoter poll={poll} setPoll={setPoll} />
		</SocketProvider>
	);
};

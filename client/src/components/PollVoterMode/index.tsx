import './PollVoterMode.css';
import { useState, useEffect } from 'react';
import { Poll } from '../App/utils';
import { DisplayPollForVoter } from '../DisplayPollForVoter';
import { SocketProvider } from '../../providers/Socket';
import { getPollByID } from './utils';
interface PollVoterModeProps {}

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
			numOfVotes: 0,
			id: 'no',
		},
	],
	timer: false,
	done: false,
};

export const PollVoterMode = ({}: PollVoterModeProps) => {
	const [poll, setPoll] = useState<Poll | null>(null);
	const [fetchState, setFetchState] = useState<FetchState>(
		FetchState.NotStarted,
	);

	useEffect(() => {
		const queryString = window.location.search;
		const params = new URLSearchParams(queryString);
		const pollID = params.get('pollID');
		console.log(pollID);
		if (pollID) {
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
		}
	}, []);

	return !poll ? (
		<span style={{ color: 'white' }}>loading...</span>
	) : (
		<DisplayPollForVoter poll={poll} />
	);
};

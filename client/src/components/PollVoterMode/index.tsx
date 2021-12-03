import './PollVoterMode.css';
import { useState, useEffect } from 'react';
import { Poll } from '../App/utils';
import { DisplayPollForVoter } from '../DisplayPollForVoter';
import { SocketProvider } from '../../providers/Socket';
import { getPollByID } from './utils';
import { TypeOfClient } from '../App/utils';
import { Loader } from '../Loader';
interface PollVoterModeProps {
	pollID: string;
}

enum FetchState {
	Loading = 'LOADING',
	Error = 'Error',
	Successful = 'SUCCESSFUL',
	NotStarted = 'NOTSTARTED',
}

export const PollVoterMode = ({ pollID }: PollVoterModeProps) => {
	const [poll, setPoll] = useState<Poll | null>(null);
	const [fetchState, setFetchState] = useState<FetchState>(
		FetchState.NotStarted,
	);

	useEffect(() => {
		setFetchState(FetchState.Loading);
		const giveASecondToLoader = setTimeout(() => {
			getPollByID(pollID)
				.then((response) => {
					if (response.data.poll) {
						setPoll(response.data.poll);
						setFetchState(FetchState.Successful);
					} else {
						setFetchState(FetchState.Error);
					}
				})
				.catch(() => {
					setFetchState(FetchState.Error);
				});
		}, 500);
		return () => {
			clearTimeout(giveASecondToLoader);
		};
	}, [pollID]);

	if (!poll)
		return (
			<span className="PollVoterMode--no-poll">
				{fetchState === FetchState.Loading && <Loader />}
				{fetchState === FetchState.Error && (
					<>
						<h3>Poll not found</h3>
						<a href="/">go back</a>
					</>
				)}
			</span>
		);
	else
		return (
			<SocketProvider typeOfClient={TypeOfClient.Voter} pollID={pollID}>
				<DisplayPollForVoter poll={poll} setPoll={setPoll} />
			</SocketProvider>
		);
};

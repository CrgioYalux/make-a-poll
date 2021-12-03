import './PollCreatorMode.css';
import { useState, useEffect } from 'react';
import { Poll } from '../App/utils';
import { DisplayPollForCreator } from '../DisplayPollForCreator';
import { CreatePoll } from '../CreatePoll';
import { postPoll } from './utils';
import { SocketProvider } from '../../providers/Socket';
import { TypeOfClient } from '../App/utils';
import { Loader } from '../Loader';

interface PollCreatorModeProps {}

enum PostState {
	NotStarted = 'NOTSTARTED',
	Error = 'ERROR',
	Successful = 'SUCCESSFUL',
	Loading = 'LOADING',
}

export const PollCreatorMode = ({}: PollCreatorModeProps) => {
	const [poll, setPoll] = useState<Poll | null>(null);
	const [postState, setPostState] = useState<PostState>(PostState.NotStarted);
	const [pollID, setPollID] = useState<string>('');

	useEffect(() => {
		if (
			poll &&
			(postState === PostState.NotStarted || postState === PostState.Error)
		) {
			setPostState(PostState.Loading);
			const giveASecondToLoader = setTimeout(() => {
				postPoll(poll)
					.then((response) => {
						if (response.data.pollID) {
							setPollID(response.data.pollID);
							setPostState(PostState.Successful);
						} else {
							setPostState(PostState.Error);
						}
					})
					.catch(() => {
						setPostState(PostState.Error);
					});
			}, 500);
			return () => {
				clearTimeout(giveASecondToLoader);
			};
		}
	}, [poll]);

	if (!poll) return <CreatePoll setPoll={setPoll} />;
	else
		return (
			<>
				<span className="PollCreatorMode--no-poll">
					{postState === PostState.Loading && (
						<>
							<h3>creating</h3>
							<Loader />
						</>
					)}
					{postState === PostState.Error && (
						<>
							<h3>An error has ocurred while creating the poll</h3>
							<a href="/">go back</a>
						</>
					)}
				</span>
				{postState === PostState.Successful && (
					<SocketProvider typeOfClient={TypeOfClient.Creator} pollID={pollID}>
						<DisplayPollForCreator poll={poll} pollID={pollID} />
					</SocketProvider>
				)}
			</>
		);
};

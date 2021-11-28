import './PollCreatorMode.css';
import { useState, useEffect } from 'react';
import { Poll } from '../App/utils';
import { DisplayPollForCreator } from '../DisplayPollForCreator';
import { CreatePoll } from '../CreatePoll';
import { postPoll } from './utils';
import { SocketProvider } from '../../providers/Socket';

interface PollCreatorModeProps {}

enum PostState {
	NotStarted = 'NOTSTARTED',
	Error = 'ERROR',
	Successful = 'SUCCESSFUL',
	Loading = 'LOADING',
}

const mockPoll: Poll = {
	done: false,
	timer: false,
	title:
		"trying, the displaying and styling of the poll from the creator's pov",
	votes: [
		{
			id: '1',
			option: 'yes',
			numOfVotes: 0,
		},
		{
			id: '2',
			option: 'no',
			numOfVotes: 1,
		},
	],
};

export const PollCreatorMode = ({}: PollCreatorModeProps) => {
	const [poll, setPoll] = useState<Poll | null>(null);
	// const [poll, setPoll] = useState<Poll | null>(mockPoll);
	const [postState, setPostState] = useState<PostState>(PostState.NotStarted);
	// const [postState, setPostState] = useState<PostState>(PostState.Successful);
	const [pollID, setPollID] = useState<string>('');
	// const [pollID, setPollID] = useState<string>('abc');

	useEffect(() => {
		if (
			poll &&
			(postState === PostState.NotStarted || postState === PostState.Error)
		) {
			setPostState(PostState.Loading);
			postPoll(poll)
				.then((response) => {
					if (response.data.pollID) {
						setPollID(response.data.pollID);
						setPostState(PostState.Successful);
					}
				})
				.catch(() => {
					setPostState(PostState.Error);
				});
		}
	}, [poll]);

	return !poll ? (
		<CreatePoll setPoll={setPoll} />
	) : (
		<>
			{postState === PostState.Loading && (
				<span style={{ color: 'white' }}>Creating...</span>
			)}
			{postState === PostState.Error && (
				<span style={{ color: 'white' }}>
					An error has ocurred while creating the poll. Please, try later.
				</span>
			)}
			{postState === PostState.Successful && (
				<SocketProvider pollID={pollID} path="/socket/">
					<DisplayPollForCreator poll={poll} pollID={pollID} />
				</SocketProvider>
			)}
		</>
	);
};

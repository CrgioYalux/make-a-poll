import './PollCreatorMode.css';
import { useState, useEffect } from 'react';
import { Poll } from '../App/utils';
import { DisplayPollForCreator } from '../DisplayPollForCreator';
import { CreatePoll } from '../CreatePoll';
import { postPoll } from './utils';

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
				<DisplayPollForCreator pollID={pollID} />
			)}
		</>
	);
};

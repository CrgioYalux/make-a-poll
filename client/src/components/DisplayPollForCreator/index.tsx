import './DisplayPollForCreator.css';
import {} from 'react';
interface DisplayPollForCreatorProps {
	pollID: string;
}

export const DisplayPollForCreator = ({
	pollID,
}: DisplayPollForCreatorProps) => {
	return (
		<div className="DisplayPollForCreator-container">
			<strong style={{ color: 'white' }}>{pollID}</strong>
		</div>
	);
};

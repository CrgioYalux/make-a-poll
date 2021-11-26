import { useState, useRef, SyntheticEvent } from 'react';
import { Poll } from '../App/utils';
import { generateKey } from './utils';
import './CreatePoll.css';
interface CreatePollProps {
	setPoll: React.Dispatch<React.SetStateAction<Poll | null>>;
}

export const CreatePoll = ({ setPoll }: CreatePollProps) => {
	const [pollTitle, setPollTitle] = useState<string>('');
	const [pollOptions, setPollOptions] = useState<
		{ option: string; numOfVotes: number; id: string }[]
	>([]);
	const addOptionInputRef = useRef<HTMLInputElement | null>(null);
	const [usingTimer, setUsingTimer] = useState<boolean>(false);
	const [seconds, setSeconds] = useState<number>(0);
	const [minutes, setMinutes] = useState<number>(5);

	const addOption = (event: SyntheticEvent) => {
		event.preventDefault();
		if (addOptionInputRef.current) {
			const value = addOptionInputRef.current.value.trim();
			if (value && !pollOptions.find(({ option }) => option === value)) {
				setPollOptions((prev) => [
					...prev,
					{ option: value, id: generateKey(value), numOfVotes: 0 },
				]);
				addOptionInputRef.current.value = '';
			} else {
				addOptionInputRef.current.classList.add('_error');
				const deleteClass = setTimeout(() => {
					addOptionInputRef.current?.classList.remove('_error');
				}, 1500);
				return () => clearTimeout(deleteClass);
			}
			addOptionInputRef.current.focus();
		}
	};

	const deleteOption = ({ option, id }: { option: string; id: string }) => {
		const _pollOptions = pollOptions.filter(
			(el) => el.option !== option && el.id !== id,
		);
		setPollOptions(_pollOptions);
	};

	const createPoll = () => {
		if (pollTitle && pollOptions.length !== 0) {
			setPoll({
				title: pollTitle,
				votes: pollOptions,
				timer: usingTimer ? { minutes, seconds } : false,
				done: false,
			});
		}
	};

	const isValidPoll = Boolean(pollTitle && pollOptions.length !== 0);

	return (
		<div className="CreatePoll-container">
			<label htmlFor="poll-title-input" className="poll-title">
				<span className="poll-title-text">What's the poll for?</span>
				<input
					type="text"
					value={pollTitle}
					className="poll-input poll-title-input"
					name="poll-title-input"
					id="poll-title-input"
					onChange={(e) => setPollTitle(e.currentTarget.value)}
					placeholder="e.g. Should I..."
					autoFocus
				/>
			</label>
			<div className="poll-timer">
				<label htmlFor="add-timer-checkbox">
					<span className="add-timer-text">Do you want to set a timer?</span>
					<input
						type="checkbox"
						name="add-timer-checkbox"
						id="add-timer-checkbox"
						className="add-timer-checkbox"
						checked={usingTimer}
						onChange={() => {
							setUsingTimer((prev) => !prev);
						}}
					/>
				</label>
				<div
					className={
						usingTimer
							? 'poll-timer-setter _using_timer'
							: 'poll-timer-setter _not_using_timer'
					}
				>
					<label htmlFor="time-minutes">
						<input
							className="poll-timer-input"
							type="number"
							min={0}
							name="time-minutes"
							id="time-minutes"
							value={minutes}
							onChange={(e) => {
								setMinutes(Number(e.currentTarget.value));
							}}
							readOnly={!usingTimer}
						/>
						<span className="poll-timer-text">minutes</span>
					</label>
					<label htmlFor="time-seconds">
						<input
							className="poll-timer-input"
							type="number"
							min={0}
							max={60}
							name="time-seconds"
							id="time-seconds"
							value={seconds}
							onChange={(e) => {
								setSeconds(Number(e.currentTarget.value));
							}}
							readOnly={!usingTimer}
						/>
						<span className="poll-timer-text">seconds</span>
					</label>
				</div>
			</div>
			<div className="poll-options">
				<span className="add-options-text">Add some options</span>
				<form onSubmit={addOption}>
					<input
						ref={addOptionInputRef}
						type="text"
						className="poll-input poll-option-input"
						id="poll-option-input"
					/>
					<button type="submit" className="poll-option-add-bt">
						+
					</button>
				</form>
				<ul
					className={
						pollOptions.length
							? 'poll-options-list _not_empty'
							: 'poll-options-list _empty'
					}
				>
					{pollOptions.map(({ option, id }, index) => (
						<li key={id} className="poll-option">
							<span className="option-index">#{index + 1}</span>
							<small className="option-text">{option}</small>
							<button
								className="option-delete-bt"
								onClick={() => deleteOption({ option, id })}
							>
								x
							</button>
						</li>
					))}
				</ul>
			</div>
			<button
				disabled={!isValidPoll}
				className="poll-create-bt"
				onClick={createPoll}
			>
				create poll
			</button>
		</div>
	);
};

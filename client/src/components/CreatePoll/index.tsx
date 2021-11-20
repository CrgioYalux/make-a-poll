import { useState, useRef, SyntheticEvent } from 'react';
import './CreatePoll.css';

interface CreatePollProps {}

export const CreatePoll = ({}: CreatePollProps) => {
	const [pollTitle, setPollTitle] = useState<string>('');
	const [pollOptions, setPollOptions] = useState<
		{ text: string; id: string }[]
	>([]);
	const addOptionInputRef = useRef<HTMLInputElement | null>(null);

	const addOption = (event: SyntheticEvent) => {
		event.preventDefault();
		if (addOptionInputRef.current) {
			const value = addOptionInputRef.current.value.trim();
			if (value && !pollOptions.find((el) => el.text === value)) {
				setPollOptions((prev) => [...prev, { text: value, id: value }]);
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

	const deleteOption = ({ text, id }: { text: string; id: string }) => {
		const _pollOptions = pollOptions.filter(
			(el) => el.text !== text && el.id !== id,
		);
		setPollOptions(_pollOptions);
	};

	const isValidPoll = Boolean(pollTitle && pollOptions.length !== 0);

	return (
		<div className="CreatePoll-container">
			<h3>What's the poll for?</h3>
			<input
				type="text"
				placeholder="Should I..."
				className="poll-input poll-title-input"
				value={pollTitle}
				id="poll-title-input"
				onChange={(e) => setPollTitle(e.currentTarget.value)}
				autoFocus
			/>
			<h4>Add some options</h4>
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
				{pollOptions.map(({ text, id }, index) => (
					<li key={id} className="poll-option">
						<span className="option-index">#{index + 1}</span>
						<small className="option-text">{text}</small>
						<button
							className="option-delete-bt"
							onClick={() => deleteOption({ text, id })}
						>
							x
						</button>
					</li>
				))}
			</ul>
			<button disabled={!isValidPoll} className="poll-create-bt">
				create poll
			</button>
		</div>
	);
};

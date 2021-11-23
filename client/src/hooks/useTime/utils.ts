export type Time = {
	seconds: number;
	minutes: number;
};

export type Period = {
	from: Time;
	to: Time;
};

export const TimePreConfig = {
	FromZero: { seconds: 0, minutes: 0 },
	ToInfinite: { seconds: 0, minutes: Number.POSITIVE_INFINITY },
	FromZeroToInfinite: {
		from: { seconds: 0, minutes: 0 },
		to: { seconds: 0, minutes: Number.POSITIVE_INFINITY },
	},
};

export const formatTime = (time: Time): string => {
	return `${time.minutes < 10 ? '0' + String(time.minutes) : time.minutes}:${
		time.seconds < 10 ? '0' + String(time.seconds) : time.seconds
	}`;
};

export const timeToSeconds = (time: Time): number => {
	return time.minutes * 60 + time.seconds;
};

export const secondsToTime = (seconds: number): Time => {
	return {
		minutes: Math.floor(seconds / 60),
		seconds: seconds % 60,
	};
};

export const addTwoTimes = (timeA: Time, timeB: Time): Time => {
	const addedSeconds = (timeA.seconds + timeB.seconds) % 60;
	const addedMinutes =
		timeA.minutes +
		timeB.minutes +
		Math.floor((timeA.seconds + timeB.seconds) / 60);
	return {
		seconds: addedSeconds,
		minutes: addedMinutes,
	};
};

export const subtractTwoTimes = (timeA: Time, timeB: Time): Time => {
	const timeAToSeconds = timeToSeconds(timeA);
	const timeBtoSeconds = timeToSeconds(timeB);
	const subtraction =
		timeAToSeconds > timeBtoSeconds
			? timeAToSeconds - timeBtoSeconds
			: timeBtoSeconds - timeAToSeconds;
	const subtractionToTime = secondsToTime(subtraction);
	return subtractionToTime;
};

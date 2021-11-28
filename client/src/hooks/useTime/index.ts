import { useState, useEffect, useRef } from 'react';
import { secondsToTime, Time, timeToSeconds } from './utils';

export interface useTimerProps {
	from?: Time;
	to?: Time;
	autostart?: boolean;
}

export interface useTimerValues {
	timer: Time;
	stopTimer: () => void;
	startTimer: () => void;
	restartTimer: () => void;
	addTimeOnRunning: (add: number) => boolean;
	isTimerRunning: boolean;
}

const defaultTime = {
	from: {
		minutes: 0,
		seconds: 0,
	},
	to: {
		minutes: Number.POSITIVE_INFINITY,
		seconds: 0,
	},
};

export const useTimer = ({
	from = defaultTime.from,
	to = defaultTime.to,
	autostart = false,
}: useTimerProps): useTimerValues => {
	const [seconds, setSeconds] = useState<number>(from.seconds);
	const [minutes, setMinutes] = useState<number>(from.minutes);
	const [counterRunning, setCounterRunning] = useState<boolean>(autostart);

	const counterRef = useRef<NodeJS.Timeout | null>(null);

	const stopCounting = (): void => {
		counterRef.current && clearTimeout(counterRef.current);
		setCounterRunning(false);
	};

	const startCounting = (): void => {
		setCounterRunning(true);
	};

	const restartCounting = (): void => {
		setSeconds(from.seconds);
		setMinutes(from.minutes);
	};

	const addTimeOnRunning = (add: number): boolean => {
		const actualTimeInSeconds = timeToSeconds({ minutes, seconds });
		const toTimeInSeconds = timeToSeconds(to);
		const updatedTime = actualTimeInSeconds + add;
		if (updatedTime < 0) {
			setSeconds(0);
			setMinutes(0);
			return true;
		} else if (updatedTime > toTimeInSeconds) {
			stopCounting();
			setSeconds(to.seconds);
			setMinutes(to.minutes);
			return false;
		} else {
			const { seconds, minutes } = secondsToTime(updatedTime);
			setSeconds(seconds);
			setMinutes(minutes);
			return true;
		}
	};

	useEffect(() => {
		if (autostart) startCounting();
		return () => stopCounting();
	}, [autostart]);

	useEffect(() => {
		if (counterRunning) {
			counterRef.current && clearTimeout(counterRef.current);
			counterRef.current = setTimeout(() => {
				let prevSeconds = seconds;
				setSeconds((s) => (s === 59 ? 0 : s + 1));
				if (prevSeconds === 59) {
					setMinutes((m) => m + 1);
				}
			}, 1000);
		}
	}, [counterRunning, seconds]);

	useEffect(() => {
		if (seconds >= to.seconds && minutes >= to.minutes) {
			stopCounting();
		}
	}, [seconds, minutes, to]);

	return {
		timer: { seconds, minutes },
		stopTimer: stopCounting,
		startTimer: startCounting,
		restartTimer: restartCounting,
		addTimeOnRunning,
		isTimerRunning: counterRunning,
	};
};

export interface useCountdownValues {
	countdown: Time;
	stopCountdown: () => void;
	startCountdown: () => void;
	restartCountdown: () => void;
	isCountdownRunning: boolean;
}
export interface useCountdownProps {
	from?: Time;
	to?: Time;
	autostart?: boolean;
}

export const useCountdown = ({
	from = { seconds: 0, minutes: 5 },
	to = { seconds: 0, minutes: 0 },
	autostart = false,
}: useCountdownProps): useCountdownValues => {
	const [seconds, setSeconds] = useState(from.seconds);
	const [minutes, setMinutes] = useState(from.minutes);
	const [counterRunning, setCounterRunning] = useState<boolean>(autostart);

	const counterRef = useRef<NodeJS.Timeout | null>(null);

	const stopCounting = () => {
		counterRef.current && clearInterval(counterRef.current);
		setCounterRunning(false);
	};

	const startCounting = () => {
		setCounterRunning(true);
	};

	const restartCounting = () => {
		setSeconds(from.seconds);
		setMinutes(from.minutes);
	};

	useEffect(() => {
		counterRef.current && clearInterval(counterRef.current);
		counterRef.current = setInterval(() => {
			setSeconds((s) => s - 1);
		}, 1000);
		return () => {
			stopCounting();
		};
	}, []);

	useEffect(() => {
		seconds === to.seconds && minutes === to.minutes
			? stopCounting()
			: !seconds &&
			  minutes &&
			  (() => {
					setMinutes((m) => m - 1);
					setSeconds(59);
			  })();
	}, [to, seconds, minutes]);

	return {
		countdown: { seconds, minutes },
		stopCountdown: stopCounting,
		startCountdown: startCounting,
		restartCountdown: restartCounting,
		isCountdownRunning: counterRunning,
	};
};

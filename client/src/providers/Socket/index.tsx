import io, { Socket } from 'socket.io-client';
import { createContext, useContext, useState, useEffect } from 'react';
import { Poll } from '../../components/App/utils';

interface SocketContextProps {
	socket: Socket | null;
	socketID: string;
}
const SocketContext = createContext<SocketContextProps>({
	socket: null,
	socketID: '',
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
	children: React.ReactNode;
	pollID: string;
	path: string;
	setPoll: React.Dispatch<React.SetStateAction<Poll | null>>;
}
export const SocketProvider = ({
	children,
	pollID,
	path,
	setPoll,
}: SocketProviderProps) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [socketID, setSocketID] = useState<string>('');

	useEffect(() => {
		const socketConnection = io('/', {
			transports: ['websocket', 'polling', 'flashsocket'],
			path,
			query: {
				pollID,
			},
		});
		setSocket(socketConnection);
		return () => {
			socketConnection.close();
		};
	}, [pollID]);

	useEffect(() => {
		if (socket === null) return;
		socket.on('connect', () => {
			setSocketID(socket.id);
		});
		return () => {
			socket.off('connect');
		};
	});

	useEffect(() => {
		if (socket === null) return;
		socket.on('send-poll', (data) => {
			const pollData = JSON.parse(data);
		});
		return () => {
			socket.off('send-poll');
		};
	});

	const value = {
		socketID,
		socket,
	};

	return (
		<SocketContext.Provider value={value}>{children}</SocketContext.Provider>
	);
};

import io, { Socket } from 'socket.io-client';
import { createContext, useContext, useState, useEffect } from 'react';

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
}
export const SocketProvider = ({
	children,
	pollID,
	path,
}: SocketProviderProps) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [socketID, setSocketID] = useState<string>('');

	useEffect(() => {
		if (path && pollID) {
			const socketConnection = io('http://localhost:5000', {
				// when NODE_ENV=dev, proxy just isn't enough, manually setting the domain is needed
				transports: ['websocket', 'polling', 'flashsocket'],
				path,
				query: {
					pollID,
				},
			});
			setSocket(socketConnection);
			console.log(socketConnection);
			return () => {
				socketConnection.close();
			};
		}
	}, [pollID, path]);

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

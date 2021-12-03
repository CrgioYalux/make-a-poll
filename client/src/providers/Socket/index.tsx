import io, { Socket } from 'socket.io-client';
import { createContext, useContext, useState, useEffect } from 'react';

enum TypeOfClient {
	Voter = 'VOTER',
	Creator = 'CREATOR',
	NotSet = 'NOTSET',
}
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
	typeOfClient: TypeOfClient;
}
export const SocketProvider = ({
	children,
	pollID,
	typeOfClient,
}: SocketProviderProps) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [socketID, setSocketID] = useState<string>('');

	useEffect(() => {
		if (pollID) {
			const socketConnection = io('http://192.168.100.11:5000', {
				transports: ['websocket', 'polling', 'flashsocket'],
				path: '/socket/',
				query: {
					pollID,
					typeOfClient,
				},
			});
			setSocket(socketConnection);
			return () => {
				socketConnection.close();
			};
		}
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

	const value = {
		socketID,
		socket,
	};

	return (
		<SocketContext.Provider value={value}>{children}</SocketContext.Provider>
	);
};

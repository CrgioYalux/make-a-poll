import express from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';
import { Server, Socket } from 'socket.io';
import { v4 } from 'uuid';

const app = express();

const pathToBuild =
	process.env.NODE_ENV === 'dev'
		? path.join(__dirname, '..', '..', 'client', 'build')
		: path.join(__dirname, '..', '..', '..', 'client', 'build');

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(pathToBuild));

export type Poll = {
	title: string;
	author: string;
	votes: {
		option: string;
		numOfVotes: number;
		id: string;
	}[];
	voters: {
		adress: string;
		socket: Socket;
	}[];
	timer:
		| {
				minutes: number;
				seconds: number;
		  }
		| false;
	done: boolean;
};

const polls = new Map<string, Poll>();

app.post('/polls', (request, response) => {
	const data = request.body as {
		title?: string;
		votes?: { option: string; numOfVotes: number; id: string }[];
		timer?:
			| {
					minutes: number;
					seconds: number;
			  }
			| false;
	};
	if (
		data.title !== undefined &&
		data.timer !== undefined &&
		data.votes !== undefined &&
		data.votes.length !== 0 &&
		request.socket.remoteAddress
	) {
		const pollID = v4();
		polls.set(pollID, {
			title: data.title,
			author: request.socket.remoteAddress,
			votes: data.votes,
			voters: [],
			timer: data.timer,
			done: false,
		});
		response.status(201).json({ pollID });
	} else {
		response.status(400).end();
	}
});

app.get('/polls', (request, response) => {
	const pollsValues = Array.from(polls.values()).map((poll) => {
		const { author, voters, ...rest } = poll;
		return rest;
	});
	response.status(200).send(pollsValues);
});

app.get('/polls/:id', (request, response) => {
	const poll = polls.get(request.params.id);
	if (poll) {
		const { author, voters, ...rest } = poll;
		response.status(200).json({ poll: rest });
	} else {
		response.status(404).end();
	}
});

const server = http.createServer(app);

const io = new Server(server, {
	path: '/socket/',
	serveClient: false,
});

io.on('connection', (socket) => {
	const { pollID } = socket.handshake.query;
	console.log(pollID);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

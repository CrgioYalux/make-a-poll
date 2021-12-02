import express from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';
import { Server, Socket } from 'socket.io';
import { v4 } from 'uuid';

const pathToBuild =
	process.env.NODE_ENV === 'dev'
		? path.join(__dirname, '..', '..', 'client', 'build')
		: path.join(__dirname, '..', '..', '..', 'client', 'build');

const app = express();
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
		socketID: string;
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

enum VotingProcessState {
	Error_AlreadyVoted = 'ERROR_ALREADYVOTED',
	Error_PollNotFound = 'ERROR_POLLNOTFOUND',
	Error_PollEnded = 'ERROR_POLLENDED',
	Error_BadRequest = 'ERROR_BADREQUEST',
	SuccessfullyVoted = 'SUCCESSFULLYVOTED',
}

io.on('connection', (socket) => {
	const { pollID } = socket.handshake.query as {
		pollID: string;
	};
	const { remoteAddress } = socket.request.socket;
	const { id } = socket;

	socket.join(pollID);

	socket.on('client-vote', (data) => {
		const _data = JSON.parse(data) as {
			vote: {
				id: string;
			};
		};
		if (_data.vote && pollID && remoteAddress) {
			const poll = polls.get(pollID);
			if (poll) {
				if (!poll.done) {
					const { voters, votes, author, ...rest } = poll;
					const alreadyVoted = voters.find(
						({ adress }) => adress === remoteAddress,
					);
					if (!alreadyVoted) {
						const _votes = votes.map((vote) => {
							if (_data.vote.id === vote.id) {
								return {
									option: vote.option,
									id: vote.id,
									numOfVotes: vote.numOfVotes + 1,
								};
							}
							return vote;
						});
						const _voters = [
							{ adress: remoteAddress, socketID: id },
							...voters,
						];
						polls.set(pollID, {
							voters: _voters,
							votes: _votes,
							author,
							...rest,
						});
						socket.emit(
							'vote-state',
							JSON.stringify({
								votingState: VotingProcessState.SuccessfullyVoted,
							}),
						);
						socket.broadcast.to(pollID).emit(
							'client-vote',
							JSON.stringify({
								poll: {
									votes: _votes,
									...rest,
								},
							}),
						);
					} else {
						socket.emit(
							'vote-state',
							JSON.stringify({
								votingState: VotingProcessState.Error_AlreadyVoted,
							}),
						);
					}
				} else {
					socket.emit(
						'vote-state',
						JSON.stringify({ votingState: VotingProcessState.Error_PollEnded }),
					);
				}
			} else {
				socket.emit(
					'vote-state',
					JSON.stringify({
						votingState: VotingProcessState.Error_PollNotFound,
					}),
				);
			}
		} else {
			socket.emit(
				'vote-state',
				JSON.stringify({ votingState: VotingProcessState.Error_BadRequest }),
			);
		}
	});

	socket.on('poll-ended', () => {
		const poll = polls.get(pollID);
		if (poll) {
			poll.done = true;
		}
		socket.broadcast.to(pollID).emit('poll-ended', JSON.stringify({ poll }));
	});
	const waitUntilDeletePoll = setTimeout(() => {
		polls.delete(pollID);
	}, 60 * 1000);
	return () => {
		clearTimeout(waitUntilDeletePoll);
	};
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
	console.log(`server listening on ${PORT}`);
});

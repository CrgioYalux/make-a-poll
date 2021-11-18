import express from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';

const app = express();

const pathToBuild =
	process.env.NODE_ENV === 'dev'
		? path.join(__dirname, '..', '..', 'client', 'build')
		: path.join(__dirname, '..', '..', '..', 'client', 'build');

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(pathToBuild));

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

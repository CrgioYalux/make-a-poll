import axios from 'axios';
import { Poll } from '../App/utils';

export const postPoll = (poll: Poll) => {
	return axios.post('/polls', poll);
};

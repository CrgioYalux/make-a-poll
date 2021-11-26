import axios from 'axios';

export const getPollByID = (ID: string) => {
	console.log('imhere');

	return axios.get(`/polls/${ID}`);
};

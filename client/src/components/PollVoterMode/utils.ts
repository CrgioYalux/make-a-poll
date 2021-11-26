import axios from 'axios';

export const getPollByID = (ID: string) => {
	return axios.get(`/polls/${ID}`);
};

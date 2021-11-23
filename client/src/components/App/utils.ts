export type Poll = {
	title: string;
	options: {
		text: string;
		id: string;
	}[];
	timer: {
		minutes: number;
		seconds: number;
	} | null;
};

export enum TypeOfClient {
	Voter = 'VOTER',
	Creator = 'CREATOR',
	NotSet = 'NOTSET',
}

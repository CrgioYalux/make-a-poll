export type Poll = {
	title: string;
	votes: {
		option: string;
		numOfVotes: number;
		id: string;
	}[];
	timer:
		| {
				minutes: number;
				seconds: number;
		  }
		| false;
	done: boolean;
};

export enum TypeOfClient {
	Voter = 'VOTER',
	Creator = 'CREATOR',
	NotSet = 'NOTSET',
}

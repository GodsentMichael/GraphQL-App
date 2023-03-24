export const resolvers = {
	Query: {
		checkApiStatus: () => {
			return {
				status: 'The API is working perfectly!',
			};
		},
	},
	Mutation: {
		testMutations: async () => {
			return {
				status: `The mutation is working perfectly!`
			};
		},
	},
};

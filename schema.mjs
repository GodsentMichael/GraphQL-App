import { gql } from "apollo-server";
  
export const typeDefs = gql`
    type Query{
        checkApiStatus: ApiStatus
    }

    type Mutation{
        testMutations(input: String): Test
    }

    type ApiStatus{
        status: String
    }

    type Test{
        status: String
    }
`;
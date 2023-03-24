import 'colors' // This is a module that doesn't export anything
import { ApolloServer } from 'apollo-server'
import { typeDefs } from './schema.mjs'
import { resolvers } from './resolvers.mjs'

const API_PORT = 4001

const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    introspection: true
})

// Creating a server with promises that returns a url
server.listen({ port: API_PORT ||4001 }).then(({ url }) => {
    console.log(`Server ready at: `.green + ` ${url}`.yellow)
    console.log('Query at :' .magenta + 'https://studio.apollographql.com/dev'.yellow);
}).catch(err => {
    console.log(err)
}
)

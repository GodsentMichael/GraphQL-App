const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
const {GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLInt } = require('graphql')
const app = express()

//Create a dummy data, that mocks a database.
const authors = [
    {id: 1, name: 'J.K. Rowling'},
    {id: 2, name: 'J.R.R. Tolkien'},
    {id: 3, name: 'Brent Weeks'}
]

const books = [
    {id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1},
    {id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1},
    {id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1},
    {id: 4, name: 'The Fellowship of the Ring', authorId: 2},
    {id: 5, name: 'The Two Towers', authorId: 2},
    {id: 6, name: 'The Return of the King', authorId: 2},
    {id: 7, name: 'The Way of Shadows', authorId: 3},
    {id: 8, name: 'Beyond the Shadows', authorId: 3}
]

// Define the BookType object
const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This represents a book written by an author',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        authorId: {type: GraphQLNonNull(GraphQLInt)},
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
}) 

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents an author of a book',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        books: {type: AuthorType,
            resolve: (author) => {
                return books.find(book => book.authorId === author.id)
            }
        }
    })
})
        

// RootQueryType refers to the place where we can define all the different objects that we can query from our GraphQL server.
const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    //When you wrap an object inside a parenthesis,
    //you just want to be able to return the contents
    //of that parenthesis without necessarily writing 'return'.
    fields: () => ({
        book: {type: BookType,
            description: 'A Single Book',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
        },
        books: {
            type:new GraphQLList(BookType),
            description: 'List of All Books',
            resolve: () => books
        },
        author: {type: AuthorType,
            description: 'A Single Author',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => authors.find(author => author.id === args.id)
        },
        authors: {
            type:new GraphQLList(AuthorType),
            description: 'List of All Authors',
            resolve: () => authors
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'Add a book',
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                authorId: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
               // If we had a DB we'd just query the database and add the book.
                const book = {id: books.length + 1, name: args.name, authorId: args.authorId}
                books.push(book)
                return book
            }
        },
        addAuthor: {
            type: AuthorType,
            description: 'Add an author',
            args: {
                name: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent, args) => {
                const author = {id: authors.length + 1, name: args.name}
                authors.push(author)
                return author
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

// GraphQL configuration
app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
    })
)

// Home route
app.get('/', (req, res) => {
    res.send('Hello World!')
    }
)

app.listen(3000, () => {
    console.log('Server is running on port 3000')
    }   
)
const graphql = require("graphql");
const Book = require("./Models/book");
const Author = require("./Models/author");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql;

// const books = [
//   { name: "Book 1", pages: 432, id: 1 },
//   { name: "Book 2", pages: 132, id: 2 },
//   { name: "Book 3", pages: 635, id: 3 }
// ];

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "Get all books",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    pages: { type: GraphQLInt },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return Author.findById(parent.authorID);
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "Get all Authors",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    book: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({ authorID: parent.id });
      }
    }
  })
});

//RootQuery describe how users can use the graph and grab data.
//E.g Root query to get all authors, get all books, get a particular book
//or get a particular author

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "ROot Query",
  fields: {
    book: {
      type: BookType,
      description: "a single book",
      args: { id: { type: GraphQLID } },
      // resolve: (parent, args) => books.find(book => book.id === args.id)
      resolve(parent, args) {
        return Book.findById(args.id);
      }
    },

    books: {
      type: new GraphQLList(BookType),
      description: "List all Books",
      // resolve: () => books
      resolve(parent, args) {
        return Book.find();
      }
    },
    author: {
      type: AuthorType,
      description: "get an author",
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Author.findById(args.id);
      }
    },

    authors: {
      type: new GraphQLList(AuthorType),
      description: "get all authors",

      resolve(parent, args) {
        return Author.find();
      }
    }
  }
});

//Very similar to RootQuery helps user to add/update to the database.
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "Mutates data",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        pages: { type: new GraphQLNonNull(GraphQLInt) },
        authorID: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          pages: args.pages,
          authorID: args.authorID
        });
        return book.save();
      }
    }
  }
});

//Creating a new GraphQL Schema, with options query which defines query
//we will allow users to use when they are making request.
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});

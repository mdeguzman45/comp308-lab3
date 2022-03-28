// Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Load the module dependencies
const configureMongoose = require('./config/mongoose');
const configureExpress = require('./config/express');
//
const { graphqlHTTP } = require('express-graphql');
var studentSchema = require('./graphql/studentSchemas');
// const { courseSchema } = require('./graphql/courseSchema');
var cors = require("cors");

// Create a new Mongoose connection instance
const db = configureMongoose();

// Create a new Express application instance
const app = configureExpress();

//configure GraphQL to use over HTTP
app.use('*', cors());
app.use('/graphql', cors(), graphqlHTTP({
  schema: studentSchema,
  rootValue: global,
  graphiql: true,
}));

// app.use('/graphql/course', cors(), graphqlHTTP({
//   schema: courseSchema,
//   rootValue: global,
//   graphiql: true,
// }));
//
// Use the Express application instance to listen to the '4000' port
app.listen(4000, () => console.log('Express GraphQL Server Now Running On http://localhost:4000/graphql'));

// Use the module.exports property to expose our Express application instance for external usage
module.exports = app;
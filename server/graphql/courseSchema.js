var GraphQLSchema = require("graphql").GraphQLSchema;
var GraphQLInputObjectType = require("graphql").GraphQLInputObjectType;
var GraphQLObjectType = require("graphql").GraphQLObjectType;
var GraphQLList = require("graphql").GraphQLList;
var GraphQLString = require("graphql").GraphQLString;
const { courseModel } = require("../models/Course");

const courseType = new GraphQLObjectType({
	name: "course",
	fields: function () {
		return {
			_id: {
        type: GraphQLString,
      },
			courseCode: {
        type: GraphQLString,
      },
			courseName: {
        type: GraphQLString,
      },
			section: {
        type: GraphQLString,
      },
			semester: {
        type: GraphQLString,
      }
		}
	}
});

const courseTypeInput = new GraphQLInputObjectType({
  name: 'courseType',
  fields: () => ({
		courseCode: {
			type: GraphQLString
		},
		courseName: {
			type: GraphQLString
		},
		section: {
			type: GraphQLString
		},
		semester: {
			type: GraphQLString
		},
  })
});

// create a GraphQL query type that returns all courses
// const queryType = new GraphQLObjectType({
//   name: "Query",
//   fields: function () {
//     return {
//       courses: {
//         type: new GraphQLList(courseType),
//         resolve: function () {
//           const courses = courseModel.find().exec();
//           if (!courses) {
//             throw new Error("Error");
//           }
//           return courses;
//         },
//       },
//     };
//   },
// });

module.exports.courseType = courseType;
module.exports.courseTypeInput = courseTypeInput;
// module.exports.courseSchema = new GraphQLSchema({query: queryType});
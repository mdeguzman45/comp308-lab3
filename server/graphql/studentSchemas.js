var GraphQLSchema = require("graphql").GraphQLSchema;
var GraphQLObjectType = require("graphql").GraphQLObjectType;
var GraphQLList = require("graphql").GraphQLList;
var GraphQLObjectType = require("graphql").GraphQLObjectType;
var GraphQLNonNull = require("graphql").GraphQLNonNull;
var GraphQLID = require("graphql").GraphQLID;
var GraphQLString = require("graphql").GraphQLString;
var GraphQLInt = require("graphql").GraphQLInt;
var GraphQLDate = require("graphql-date");
var StudentModel = require("../models/Student");
const { courseModel } = require("../models/Course");
const { courseType, courseTypeInput } = require("./courseSchema");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const config = require("../config/config");
const jwtExpirySeconds = 300;
const jwtKey = config.secretKey;

// Create a GraphQL Object Type for Student model
const studentType = new GraphQLObjectType({
  name: "student",
  fields: function () {
    return {
      _id: {
        type: GraphQLString,
      },
      studentNumber: {
        type: GraphQLString,
      },
      password: {
        type: GraphQLString,
      },
      firstName: {
        type: GraphQLString,
      },
      lastName: {
        type: GraphQLString,
      },
      address: {
        type: GraphQLString,
      },
      city: {
        type: GraphQLString,
      },
      phone: {
        type: GraphQLString,
      },
      email: {
        type: GraphQLString,
      },
      program: {
        type: GraphQLString,
      },
      enrolledCourses: {
        type: new GraphQLList(courseType)
      }
    };
  },
});

// Create a GraphQL Object Type for Student model
const loginType = new GraphQLObjectType({
  name: "login",
  fields: function () {
    return {
      id: {
        type: GraphQLString,
      },
      email: {
        type: GraphQLString,
      }
    };
  },
});
//
// create a GraphQL query type that returns all students or a student by id
const queryType = new GraphQLObjectType({
  name: "Query",
  fields: function () {
    return {
      students: {
        type: new GraphQLList(studentType),
        resolve: function () {
          const students = StudentModel.find().exec();
          if (!students) {
            throw new Error("Error");
          }
          return students;
        },
      },

      studentsByCourse: {
        type: new GraphQLList(studentType),
        args: {
          courseCode: {
            name: 'courseCode',
            type: GraphQLString
          }
        },
        resolve: function (root, params) {
          console.log('params coursecode -> ', params.courseCode);
          const students = StudentModel.find({ "enrolledCourses.courseCode": params.courseCode }).exec();
          if (!students) {
            throw new Error('Error')
          }
          return students;
        }
      },

      // authenticate: {
      //   type: loginType,
      //   args: {
      //     email: {
      //       name: "email",
      //       type: GraphQLString,
      //     },
      //     password: {
      //       name: "password",
      //       type: GraphQLString,
      //     },
      //   },
      //   resolve: async function (root, params) {
      //     console.log('params -> ', params);
      //     const student = await StudentModel.findOne({email: params.email}).exec()
      //     if(!student) {
      //       throw new Error('Invalid Username!');
      //     }

      //     console.log('student -> ', student);
      //     const isCorrectPassword = await bcrypt.compare(params.password, student.password);
      //     if (!isCorrectPassword) {
      //         throw new Error("Invalid Credentials!password")
      //     }

      //     // const token = jwt.sign({ _id: user._id, email: user.email }, jwtKey, {
      //     //   algorithm: "RS256"
      //     // });

      //     // console.log('token:', token)
      //     return {
      //       id: student._id,
      //       email: student.email
      //     };
      //   }
      // },

      student: {
        type: studentType,
        args: {
          id: {
            name: "_id",
            type: GraphQLString,
          },
        },
        resolve: function (root, params) {
          const studentInfo = StudentModel.findById(params.id).exec();
          if (!studentInfo) {
            throw new Error("Error");
          }
          return studentInfo;
        },
      },

      courses: {
        type: new GraphQLList(courseType),
        resolve: function () {
          const courses = courseModel.find().exec();
          if (!courses) {
            throw new Error("Error");
          }
          return courses;
        },
      }
    };
  },
});
//
// add mutations for CRUD operations
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: function () {
    return {
      addStudent: {
        type: studentType,
        args: {
          studentNumber: {
            type: new GraphQLNonNull(GraphQLString)
          },
          password: {
            type: new GraphQLNonNull(GraphQLString)
          },
          firstName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          lastName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          address: {
            type: new GraphQLNonNull(GraphQLString)
          },
          city: {
            type: new GraphQLNonNull(GraphQLString)
          },
          phone: {
            type: new GraphQLNonNull(GraphQLString)
          },
          email: {
            type: new GraphQLNonNull(GraphQLString)
          },
          program: {
            type: new GraphQLNonNull(GraphQLString)
          },
          enrolledCourses: {
            type: new GraphQLList(courseTypeInput)
          }
        },
        resolve: function (root, params) {
          const studentModel = new StudentModel(params);
          const newStudent = studentModel.save();
          if (!newStudent) {
            throw new Error("Error");
          }
          return newStudent;
        }
      },
      updateStudent: {
        type: studentType,
        args: {
          id: {
            name: "id",
            type: new GraphQLNonNull(GraphQLString)
          },
          studentNumber: {
            type: new GraphQLNonNull(GraphQLString)
          },
          password: {
            type: new GraphQLNonNull(GraphQLString)
          },
          firstName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          lastName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          address: {
            type: new GraphQLNonNull(GraphQLString)
          },
          city: {
            type: new GraphQLNonNull(GraphQLString)
          },
          phone: {
            type: new GraphQLNonNull(GraphQLString)
          },
          email: {
            type: new GraphQLNonNull(GraphQLString)
          },
          program: {
            type: new GraphQLNonNull(GraphQLString)
          },
          enrolledCourses: {
            type: new GraphQLList(courseTypeInput)
          }
        },
        resolve(root, params) {
            return StudentModel.findByIdAndUpdate(params.id, { studentNumber: params.studentNumber,
            password: params.password, firstName: params.firstName, lastName: params.lastName,
            address: params.address, city: params.city, phone: params.phone, email: params.email, program: params.program,
            enrolledCourses: params.enrolledCourses
        }, function (err) {
            if (err) return next(err);
        });
        }
      },
      deleteStudent: {
        type: studentType,
        args: {
          id: {
              type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(root, params) {
          const deletedStudent = StudentModel.findByIdAndRemove(params.id).exec();
          if (!deletedStudent) {
              throw new Error('Error')
          }
          return deletedStudent;
        }
      },

      authenticate: {
        type: loginType,
        args: {
          email: {
            type: new GraphQLNonNull(GraphQLString),
          },
          password: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve: async function (root, params) {
          console.log('params -> ', params);
          const student = await StudentModel.findOne({email: params.email}).exec()
          if(!student) {
            throw new Error('Invalid Username!');
          }

          console.log('student -> ', student);
          const isCorrectPassword = await bcrypt.compare(params.password, student.password);
          if (!isCorrectPassword) {
              throw new Error("Invalid Credentials!password")
          }

          // const token = jwt.sign({ _id: user._id, email: user.email }, jwtKey, {
          //   algorithm: "RS256"
          // });

          // console.log('token:', token)
          return {
            id: student._id,
            email: student.email
          };
        }
      },
    };
  },
});

//
module.exports = new GraphQLSchema({query: queryType, mutation: mutation});
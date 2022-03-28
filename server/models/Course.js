// Load the Mongoose module and Schema object
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Schema
const CourseSchema = new Schema({
	courseCode: String,
	courseName: String,
	section: String,
	semester: String
});
mongoose.model('Course', CourseSchema);

module.exports.courseSchema = CourseSchema;
module.exports.courseModel = mongoose.model('Course', CourseSchema)
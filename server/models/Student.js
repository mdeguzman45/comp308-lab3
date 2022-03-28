// Load the Mongoose module and Schema object
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { courseSchema } = require('./Course');

// Define a new 'StudentSchema'
const StudentSchema = new Schema({
    id: String,
    studentNumber: String,
    password: String,
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    phone: String,
    email: String,
    program: String,
    enrolledCourses: [courseSchema]
});

StudentSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
});

// Create the 'Student' model out of the 'StudentSchema'
module.exports = mongoose.model('Student', StudentSchema);
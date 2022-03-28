import React, { useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import CourseCard from "./AllCoursesCard";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DialogActions } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useAuth } from "../auth";
import { gql, useQuery, useMutation } from "@apollo/client";

const useStyles = makeStyles((theme) => {
  return {
    courseListHeading: {
      paddingBottom: "5px",
    },
  };
});

const GET_COURSES = gql`
{
  courses {
    _id
    courseCode
    courseName
    section
    semester
  }
}
`;

const GET_STUDENT = gql`
query getStudent($studentID: String!) {
  student(id: $studentID) {
    _id
    studentNumber
    password
    firstName
    lastName
    address
    city
    phone
    email
    program
    enrolledCourses {
      _id
      courseCode
      courseName
      section
      semester
    }
    __typename
  }
}`;

const UPDATE_STUDENT = gql`
mutation UpdateStudent(
	$id: String!,
	$studentNumber: String!,
	$password: String!,
	$firstName: String!,
	$lastName: String!,
	$address: String!,
	$city: String!,
	$phone: String!,
	$email: String!,
	$program: String!,
	$enrolledCourses: [courseType]
) {
	updateStudent(
		id: $id,
		studentNumber: $studentNumber,
		password: $password,
		firstName: $firstName,
		lastName: $lastName,
		address: $address,
		city: $city,
		phone: $phone,
		email: $email,
		program: $program,
		enrolledCourses: $enrolledCourses
	) {
		_id
		studentNumber
		password
		firstName
		lastName
		address
		city
		phone
		email
		program
		enrolledCourses {
			_id
			courseCode
			courseName
			section
			semester
		}
		__typename
	}
}`;

export default function AllCourses({showSnackBar}) {

  const classes = useStyles();
  const [courses, setCourses] = useState([]);
  const { authTokens } = useAuth();
  const [studentId, setStudentId] = useState(authTokens.id);
  const [course, setCourse] = useState(null);
  const [student, setStudent] = useState(null);
  const [section, setSection] = useState('');
  const [semester, setSemester] = useState('');

  const navigate = useNavigate();

  // for Dialog Form
  const [openEnrollDialog, setopenEnrollDialog] = useState(false);

  // get courses
  const { loadingCourses, errorLoadingCourses, data, refetchCourses } = useQuery(GET_COURSES, 
    {onCompleted: data => {
      
      if (data && data.courses) {
        console.log('courseData -> ', data);
        setCourses(data.courses);
      }
    }}
  );

  // get the student data
	const { loadingStudent, errorLoadingStudent, studentData, refetch } = useQuery(GET_STUDENT, 
    {
			variables: { "studentID": studentId },
			onCompleted: data => {
      
      if (data && data.student) {
        console.log('studentData -> ', data);
				const studentData = data.student;
				setStudent(studentData);
      }
    }}
  );

  // update student data
	const [updateStudent, { updateData, loadingUpdateStudent, errorUpdateStudent }] = useMutation(UPDATE_STUDENT,
		{
		onCompleted: data => {
			console.log(data);
      const sbMsg = `Enroll course ${course.courseCode} - ${course.courseName} successful`;
			showSnackBar({message: sbMsg, severity: 'success'});
      setCourse(null);
      navigate("/mycourses");
		},
		onError: error => {
      console.log(error);
      const sbMsg = `Enroll course ${course.courseCode} - ${course.courseName} failed`;
			showSnackBar({message: sbMsg, severity: 'error'});
		}
	});

  if (loadingCourses) return <p>Loading...</p>;
  if (errorLoadingCourses) return <p>Error Loading Courses</p>;

  const handleEnrollClose = () => {
    setopenEnrollDialog(false);
  };

  const handleAction = (course, action) => {
    setCourse(course);
    console.log("Do ", action);
    console.log("On course ", course);
    if (action === "Class List") {
      navigate("/classlist", { state: { courseCode: course.courseCode } });
      setCourse(null);
    } else if (action === "Enroll") {
      setopenEnrollDialog(true);
    }
    // reset the selected course
    // setCourse(null);
  };

  const enrollStudentToCourse = () => {
    let sbMsg = '';
    const studentRequest = {...student, id: studentId};
    
    const enrollData = {
      courseCode: course.courseCode,
      courseName: course.courseName,
      section: section,
      semester: semester
    };

    // create a deep copy of the courses
    const localEnrolledCourse = studentRequest.enrolledCourses.map(course => ({...course}));
    console.log('localEnrolledCourse -> ', localEnrolledCourse);  
    // remove _typename and _id on course objects to fix request failure
    localEnrolledCourse.forEach(course => {
      if (course._id) {
        delete course._id;
      }
      if (course.__typename) {
        delete course.__typename;
      }
    });
 
    studentRequest.enrolledCourses = [...localEnrolledCourse, enrollData];

    // remove _id and _typename
    delete studentRequest._id;
    delete studentRequest.__typename;

    console.log('enroll course student request -> ', studentRequest);  

    // call the mutation
		updateStudent({ variables: studentRequest });
    handleEnrollClose();
  }

  return (
    <Container>
      {courses.length > 0 ? (
        <div>
          <Typography
            variant="h5"
            color="textPrimary"
            className={classes.courseListHeading}
          >
            All Courses
          </Typography>

          <Grid container spacing={3}>
            {courses.map((course) => (
              <Grid item key={course._id} xs={12} md={6} lg={4}>
                <CourseCard course={course} handleAction={handleAction} />
              </Grid>
            ))}
          </Grid>
        </div>
      ) : (
        <Typography variant="h5" color="textPrimary">
          No courses found
        </Typography>
      )}

      {course && (
        <div>
          <Dialog open={openEnrollDialog} onClose={handleEnrollClose}>
            <DialogTitle>Course Code: {course.courseCode}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="courseCode"
                label="Course Code"
                value={course.courseCode}
                type="text"
                fullWidth
                disabled
                variant="outlined"
                InputProps={{ style: { fontSize: 12 } }}
                InputLabelProps={{ style: { fontSize: 12 } }}
              />
              <TextField
                autoFocus
                margin="dense"
                id="courseName"
                label="Course Name"
                value={course.courseName}
                type="text"
                fullWidth
                disabled
                variant="outlined"
                InputProps={{ style: { fontSize: 12 } }}
                InputLabelProps={{ style: { fontSize: 12 } }}
              />
              <TextField
                autoFocus
                margin="dense"
                id="section"
                label="Section"
                type="text"
                fullWidth
                variant="outlined"
                InputProps={{ style: { fontSize: 12 } }}
                InputLabelProps={{ style: { fontSize: 12 } }}
                onChange={(e) => setSection(e.target.value)}
              />
              <TextField
                autoFocus
                margin="dense"
                id="semester"
                label="Semester"
                type="text"
                fullWidth
                variant="outlined"
                InputProps={{ style: { fontSize: 12 } }}
                InputLabelProps={{ style: { fontSize: 12 } }}
                onChange={(e) => setSemester(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleEnrollClose}>Cancel</Button>
              <Button onClick={enrollStudentToCourse}>Submit</Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </Container>
  );
}

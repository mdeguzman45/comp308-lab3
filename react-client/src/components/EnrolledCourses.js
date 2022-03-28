import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import EnrolledCourseCard from "./EnrolledCourseCard";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useAuth } from "../auth";
import { TextField } from "@mui/material";
import { gql, useQuery, useMutation } from "@apollo/client";

const useStyles = makeStyles((theme) => {
  return {
    courseListHeading: {
      paddingBottom: "5px",
    },
  };
});

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

export default function EnrolledCourses({ showSnackBar }) {
  const { authTokens } = useAuth();
  const [studentId, setStudentId] = useState(authTokens.id);
  const classes = useStyles();
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [dropCourseConfirmMsg, setDropCourseConfirmMsg] = useState("");
  const [openConfirmDropCourse, setOpenConfirmDropCourse] = useState(false);
  const [listError, setListError] = useState(false);
  const navigate = useNavigate();
  const [section, setSection] = useState("");
  const [semester, setSemester] = useState("");

  // get the student data
	const { loadingStudent, errorLoadingStudent, studentData, refetch } = useQuery(GET_STUDENT, 
    {
			variables: { "studentID": studentId },
			onCompleted: data => {
      
      if (data && data.student) {
        console.log('studentData -> ', data);
				const studentData = data.student;
				setStudent(studentData);
        setCourses(studentData.enrolledCourses);
      }
    }}
  );

  // update student data
  const [updateStudent, { updateData, loadingUpdateStudent, errorUpdateStudent }] = useMutation(UPDATE_STUDENT);

  // for Dialog Form
  const [openUpdateCourseDialog, setOpenUpdateCourseDialog] = useState(false);

  const handleUpdateCourseClose = () => {
    setOpenUpdateCourseDialog(false);
  };

  const deepCopyCourses = () => {
    const deepCopy = courses.map(course => ({...course}));
    return deepCopy;
  }

  const updateStudentCourse = () => {
    let sbMsg = "";

    // create a deep copy of the courses
    const localEnrolledCourses = deepCopyCourses();
    const updatedCourses = localEnrolledCourses.filter(
      (aCourse) => aCourse.courseCode !== course.courseCode
    );

    // remove _typename and _id on course objects to fix request failure
    updatedCourses.forEach(course => {
      if (course._id) {
        delete course._id;
      }
      if (course.__typename) {
        delete course.__typename;
      }
    });

    const updateCourseData = {
      courseCode: course.courseCode,
      courseName: course.courseName,
      section: section,
      semester: semester,
    };

    updatedCourses.push(updateCourseData);
    const studentRequest = { ...student, id: studentId, enrolledCourses: updatedCourses };

    // remove _id and _typename
    delete studentRequest._id;
    delete studentRequest.__typename;

    console.log('update course request -> ', studentRequest);

    // call mutation for updating course
    updateStudent({  
      variables: studentRequest,
      onCompleted: data => {
        console.log(data);
        sbMsg = `Update course ${course.courseCode} - ${course.courseName} successful`;
        showSnackBar({message: sbMsg, severity: 'success'});
        setCourse(null);
        refetch();
      },
      onError: error => {
        console.log(error);
        sbMsg = `Update course ${course.courseCode} - ${course.courseName} failed`;
        showSnackBar({ message: sbMsg, severity: "error" });
      }
    });

    handleUpdateCourseClose();
  };

  const handleAction = (course, action) => {
    setCourse(course);
    console.log("Do ", action);
    console.log("On course ", course);
    if (action === "Drop Course") {
      const confirmMsg = `Are you sure you want to drop ${course.courseCode} - ${course.courseName}?`;
      setDropCourseConfirmMsg(confirmMsg);
      setOpenConfirmDropCourse(true);
    } else if (action === "Class List") {
      navigate("/classlist", { state: { courseCode: course.courseCode } });
      setCourse(null);
    } else if (action === "Edit Course") {
      setOpenUpdateCourseDialog(true);
    }
  };

  const executeDropCourse = () => {
    let sbMsg = "";
    console.log("confirmed drop on course ", course);

    // create a deep copy of the courses
    const localEnrolledCourses = deepCopyCourses();
    const updatedCourses = localEnrolledCourses.filter(
      (aCourse) => aCourse.courseCode !== course.courseCode
    );

    // remove _typename and _id on course objects to fix request failure
    updatedCourses.forEach(course => {
      if (course._id) {
        delete course._id;
      }
      if (course.__typename) {
        delete course.__typename;
      }
    });

    const studentRequest = { ...student, id: studentId, enrolledCourses: updatedCourses };

    // remove _id and _typename
    delete studentRequest._id;
    delete studentRequest._typename;

    console.log("drop course request -> ", studentRequest);

    // call mutation for dropping course
    updateStudent({  
      variables: studentRequest,
      onCompleted: data => {
        console.log(data);
        sbMsg = `Drop course ${course.courseCode} - ${course.courseName} successful`;
        showSnackBar({message: sbMsg, severity: 'success'});
        refetch();
      },
      onError: error => {
        console.log(error);
        sbMsg = `Drop course ${course.courseCode} - ${course.courseName} failed`;
        showSnackBar({ message: sbMsg, severity: "error" });
      }
    });

    // clear selected course
    onCloseConfirmDropCourseDialog();
  };

  const onCloseConfirmDropCourseDialog = () => {
    console.log("onCloseConfirmDropCourseDialog");
    setCourse(null);
    setOpenConfirmDropCourse(false);
  };

  useEffect(() => {
    if (course) {
      setSemester(course.semester);
      setSection(course.section);
    }
  }, [course]);

  return (
    <div>
      {courses.length > 0 ? (
        <div>
          <Typography
            variant="h5"
            color="textPrimary"
            className={classes.courseListHeading}
          >
            My Courses
          </Typography>

          <Grid container spacing={3}>
            {courses.map((course) => (
              <Grid item key={course.courseCode} xs={12} md={6} lg={4}>
                <EnrolledCourseCard
                  course={course}
                  handleAction={handleAction}
                />
              </Grid>
            ))}
          </Grid>
          <Dialog
            open={openConfirmDropCourse}
            onClose={onCloseConfirmDropCourseDialog}
          >
            <DialogTitle>Confirm Drop Course</DialogTitle>

            <DialogContent>
              <DialogContentText>{dropCourseConfirmMsg}</DialogContentText>
            </DialogContent>

            <DialogActions>
              <Button autoFocus onClick={onCloseConfirmDropCourseDialog}>
                Cancel
              </Button>
              <Button onClick={executeDropCourse}>Confirm</Button>
            </DialogActions>
          </Dialog>
        </div>
      ) : (
        <Typography variant="h5" color="textPrimary">
          No Enrolled Courses Found
        </Typography>
      )}

      {course && (
        <div>
          <Dialog
            open={openUpdateCourseDialog}
            onClose={handleUpdateCourseClose}
          >
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
                value={section}
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
                value={semester}
                type="text"
                fullWidth
                variant="outlined"
                InputProps={{ style: { fontSize: 12 } }}
                InputLabelProps={{ style: { fontSize: 12 } }}
                onChange={(e) => setSemester(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleUpdateCourseClose}>Cancel</Button>
              <Button onClick={updateStudentCourse}>Submit</Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
}

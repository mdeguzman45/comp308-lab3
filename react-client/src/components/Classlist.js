import { ListItemButton, ListItemText } from "@mui/material";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import PersonIcon from "@mui/icons-material/Person";
import { useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { gql, useQuery } from "@apollo/client";

const GET_STUDENTS_BY_COURSE = gql`
query getStudentsByCourse($courseCode: String!) {
  studentsByCourse(courseCode: $courseCode) {
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

export default function ClassList(props) {
  const { state } = useLocation();
  console.log(state);
  const courseCode = state.courseCode;
  const [studentsInCourse, setStudentsInCourse] = useState([]);

  // query students
	const { loadingStudents, errorLoadingStudents, data, refetch } = useQuery(GET_STUDENTS_BY_COURSE, 
    {
      variables: { courseCode },
      onCompleted: data => {
      
      if (data && data.studentsByCourse) {
        // console.log(`students in course -> ${courseCode} \n ${JSON.stringify(data.studentsByCourse)}`);
        setStudentsInCourse(data.studentsByCourse);
      }
    }}
  );

  return (
    <div>
      {studentsInCourse.length !== 0 ? (
        <div>
          <Typography variant="h5" color="textPrimary">
            Class List of {courseCode}
          </Typography>
          <Box
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            <nav aria-label="Course List">
              {studentsInCourse.map((item, idx) => (
                <ListItem disablePadding key={item._id}>
                  <ListItemButton>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText>
                      {item.firstName + " " + item.lastName}
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
            </nav>
          </Box>
        </div>
      ) : (
        <Typography variant="h5" color="textPrimary">
          No students found
        </Typography>
      )}
    </div>
  );
}

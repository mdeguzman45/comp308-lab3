import { Container, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import StudentCard from './StudentCard';
import { gql, useQuery } from "@apollo/client";

const useStyles = makeStyles((theme) => {
	return {
		studentListHeading: {
			paddingBottom: "5px"
		}
	}
});

const GET_STUDENTS = gql`
{
  students {
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
  }
}
`;

export default function StudentList() {
	const classes = useStyles();
	const [students, setStudents] = useState([]);
	
	// query students
	const { loadingStudents, errorLoadingStudents, data, refetch } = useQuery(GET_STUDENTS, 
    {onCompleted: data => {
      
      if (data && data.students) {
        console.log('studentData -> ', data);
        setStudents(data.students);
      }
    }}
  );

	if (loadingStudents) return <p>Loading...</p>;
  if (errorLoadingStudents) return <p>Error Loading Students</p>;

  return (
    <Container>
			{ students.length > 0 ?
				<div>
					<Typography variant="h5" color="textPrimary" className={classes.studentListHeading}>
						Student List
					</Typography>
				
					<Grid container spacing={3}>
						{students.map(student => (
							<Grid item key={student._id} xs={12} md={6} lg={4}>
								<StudentCard student={student} />
							</Grid>
						))}
					</Grid>
				</div>
				:
				<Typography variant="h5" color="textPrimary">
					No students found
				</Typography>
			}
    </Container>
  )
}

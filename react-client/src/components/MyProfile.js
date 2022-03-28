import { Box, Container, Typography } from '@mui/material'
import TextField from '@mui/material/TextField';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import React, { useState, useEffect } from 'react'
import { useAuth } from "../auth";
import { gql, useQuery, useMutation } from "@apollo/client";

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

export default function MyProfile({showSnackBar}) {
	const { authTokens } = useAuth();
	const [studentId, setStudentId] = useState(authTokens.id);
	const [student, setStudent] = useState(null);
	
	const [studentNumber, setStudentNumber] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [address, setAddress] = useState('');
	const [city, setCity] = useState('');
	const [phone, setPhone] = useState('');
	const [program, setProgram] = useState('');
	const [enrolledCourses, setEnrolledCourses] = useState([]);

	const [fieldDisabled, setFieldDisabled] = useState(true);
	const [showEdit, setShowEdit] = useState(true);

	// errors
	const [firstNameError, setFirstNameError] = useState({error: false, errorMsg: ""});
	const [lastNameError, setLastNameError] = useState({error: false, errorMsg: ""});

	// get the student data
	const { loadingStudent, errorLoadingStudent, studentData, refetch } = useQuery(GET_STUDENT, 
    {
			variables: { "studentID": studentId },
			onCompleted: data => {
      
      if (data && data.student) {
        console.log('studentData -> ', data);
				const studentData = data.student;
				setStudent(studentData);

				setStudentNumber(studentData.studentNumber);
				setEmail(studentData.email);
				setPassword(studentData.password);
				setFirstName(studentData.firstName);
				setLastName(studentData.lastName);

				// default to blank fields that are not required
				setAddress(studentData.address || '');
				setCity(studentData.city || '');
				setPhone(studentData.phone || '');
				setProgram(studentData.program || '');

				setEnrolledCourses(studentData.enrolledCourses);
      }
    }}
  );

	// update student data
	const [updateStudent, { updateData, loadingUpdateStudent, errorUpdateStudent }] = useMutation(UPDATE_STUDENT,
		{
		onCompleted: data => {
			console.log(data);
			showSnackBar({message: 'Update Profile Successful', severity: 'success'});
			refetch();
		},
		onError: error => {
			showSnackBar({message: 'Oops! Something went wrong. Update Profile Failed', severity: 'error'});
			console.log(error);
		}
	});

	if (loadingStudent) return <p>Loading...</p>;
  if (errorLoadingStudent) return <p>Error Loading Students</p>;

	if (loadingUpdateStudent) return <p>Updating...</p>;
  if (errorUpdateStudent) return <p>Error Updating Students</p>;

	const handleSubmit = (e) => {
		e.preventDefault();

		let sbMsg = '';
		let isValid = true;

		// reset errors 
		resetErrors();

		if (firstName.trim() === '') {
			setFirstNameError({error: true, errorMsg: "First Name is required"});
			isValid = false;
		}

		if (lastName.trim() === '') {
			setLastNameError({error: true, errorMsg: "Last Name is required"});
			isValid = false;
		}

		// proceed when all required field is valid
		if (isValid) {

			const localEnrolledCourses = enrolledCourses.map(course => ({...course}));
			// remove _typename and _id on course objects to fix request failure
			localEnrolledCourses.forEach(course => {
				if (course._id) {
					delete course._id;
				}
				if (course.__typename) {
					delete course.__typename;
				}
			});

			const studentRequest = {
				id: studentId,
				studentNumber: studentNumber,
				email: email,
				password: password,
				firstName: firstName,
				lastName: lastName,
				address: address,
				city: city,
				phone: phone,
				program: program,
				enrolledCourses: localEnrolledCourses
			}

			console.log('update student request -> ', studentRequest);

			// call the mutation
			updateStudent({ variables: studentRequest });
			disableEdit();
		}
	}

	const resetErrors = () => {
		setFirstNameError({error: false, errorMsg: ""});
		setLastNameError({error: false, errorMsg: ""});
	}

	const cancelEdit = () => {
		// reset original values and clear errors
		setStudentNumber(student.studentNumber);
		setEmail(student.email);
		setFirstName(student.firstName);
		setLastName(student.lastName);
		setAddress(student.address || '');
		setCity(student.city || '');
		setPhone(student.phone || '');
		setProgram(student.program || '');

		resetErrors();
		disableEdit();
	}

	const enableEdit = () => {
		setShowEdit(false);
		setFieldDisabled(false);
	}

	const disableEdit = () => {
		setShowEdit(true);
		setFieldDisabled(true);
	}

  return (
    <Container>
			<Typography
			variant="h5" color="textPrimary"
			gutterBottom
			>
				My Profile
      </Typography>
			
			<Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
				<form autoComplete="off" noValidate>
					<div>
						<FormControl sx={{ m: 1, width: '50ch' }} >
							<TextField
								onChange={(e) => setStudentNumber(e.target.value)}
								value={studentNumber}
								label="Student Number"
								variant="outlined"
								color="primary"
								type="text"
								disabled
							/>
						</FormControl>

						<FormControl sx={{ m: 1, width: '50ch' }} >
							<TextField 
								onChange={(e) => setEmail(e.target.value)}
								value={email}
								label="Email"
								variant="outlined"
								color="primary"
								type="email"
								disabled
							/>
						</FormControl>
					</div>

					<div>
						<FormControl sx={{ m: 1, width: '50ch' }} >
							<TextField 
								onChange={(e) => setFirstName(e.target.value)}
								value={firstName}
								label="First Name"
								variant="outlined"
								color="primary"
								required
								error={firstNameError.error}
								helperText={firstNameError.errorMsg}
								disabled={fieldDisabled}
							/>
						</FormControl>
						
						<FormControl sx={{ m: 1, width: '50ch' }} >
							<TextField 
								onChange={(e) => setLastName(e.target.value)}
								value={lastName}
								label="Last Name"
								variant="outlined"
								color="primary"
								required
								error={lastNameError.error}
								helperText={lastNameError.errorMsg}
								disabled={fieldDisabled}
							/>
						</FormControl>
					</div>

					<div>
						<FormControl sx={{ m: 1,  width: '50ch' }} >
							<TextField 
								onChange={(e) => setAddress(e.target.value)}
								value={address}
								label="Address"
								variant="outlined"
								color="primary"
								disabled={fieldDisabled}
							/>
						</FormControl>

						<FormControl sx={{ m: 1, width: '50ch' }} >
							<TextField 
								onChange={(e) => setCity(e.target.value)}
								value={city}
								label="City"
								variant="outlined"
								color="primary"
								disabled={fieldDisabled}
							/>
						</FormControl>
					</div>

					<div>
						<FormControl sx={{ m: 1, width: '50ch' }} >
							<TextField 
								onChange={(e) => setPhone(e.target.value)}
								value={phone}
								label="Phone"
								variant="outlined"
								color="primary"
								disabled={fieldDisabled}
							/>
						</FormControl>

						<FormControl sx={{ m: 1, width: '50ch' }} >
							<TextField 
								onChange={(e) => setProgram(e.target.value)}
								value={program}
								label="Program"
								variant="outlined"
								color="primary"
								disabled={fieldDisabled}
							/>
						</FormControl>
					</div>
					<br />
					{showEdit ?
						<div style={{display: 'flex', justifyContent:'flex-end', width:'100%'}}>
						<Button
							type="button"
							color="warning"
							variant="contained"
							endIcon={<ModeEditOutlineOutlinedIcon />}
							onClick={enableEdit}
						> Edit </Button>
						</div>
					:
					<div style={{display: 'flex', justifyContent:'flex-end', width:'100%'}}>
						<Button
							type="button"
							color="primary"
							variant="contained"
							endIcon={<KeyboardArrowRight />}
							onClick={handleSubmit}
							style={{marginRight: '5px'}}
						> Submit </Button>
						<Button
							
							type="button"
							color="error"
							variant="contained"
							endIcon={<HighlightOffOutlinedIcon />}
							onClick={cancelEdit}
						> Cancel </Button>
					</div>
					}
				</form>
			</Box>
    </Container>
  )
}

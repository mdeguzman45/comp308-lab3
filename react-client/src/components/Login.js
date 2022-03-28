import React, { useState } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

export default function Login({ handleLogin }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [emailError, setEmailError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);

	const handleSubmit = (event) => {
    event.preventDefault();
		let isValid = true;

		setEmailError(false);
		setPasswordError(false);

    if (email === '') {
			setEmailError(true);
			isValid = false;
		}

		if (password === '') {
			setPasswordError(true);
			isValid = false;
		}

		if (isValid) {
			handleLogin(email, password);
		}
  };

  return (
    <Container maxWidth="xs">
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign in
        </Typography>
				<Box component="form" noValidate onSubmit={handleSubmit} autoComplete='off' sx={{ mt: 1 }}>
					<TextField
						margin="normal"
						onChange={(e) => setEmail(e.target.value)}
						required
						fullWidth
						variant="outlined"
						label="Email Address"
						type="email"
						autoFocus
						error={emailError}
					/>
					<TextField
						margin="normal"
						onChange={(e) => setPassword(e.target.value)}
						required
						fullWidth
						label="Password"
						type="password"
						variant="outlined"
						autoComplete="current-password"
						error={passwordError}
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Sign In
					</Button>
					<Grid container>
						<Grid item xs>
							<Link href="#" variant="body2">
								Forgot password?
							</Link>
						</Grid>
						<Grid item>
							<Link href="/register" variant="body2">
								{"Don't have an account? Sign Up"}
							</Link>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Container>
  )
}

import React from 'react'
import { makeStyles } from '@mui/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List';
import ListItem  from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SchoolOutlined from '@mui/icons-material/SchoolOutlined';
import LibraryBooksOutlined from '@mui/icons-material/LibraryBooksOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';

const drawerWidth = 200

const useStyles = makeStyles((theme) => {
    return {
			page: {
				// background: '#f9f9f9',
				width: '100%',
				padding: theme.spacing(3)
			},
      root: {
				display: 'flex'
			},
			drawer: {
				width: drawerWidth
			},
			drawerPaper: {
				width: drawerWidth
			},
			active: {
				background: '#f4f4f4'
			},
    }
})

export default function Layout({ children }) {
	const classes = useStyles();
	const navigate = useNavigate();
	const location = useLocation();

	const menuItems = [
		{
			text: 'My Courses',
			icon: <LibraryBooksOutlined color="primary" />,
			path: '/mycourses'
		},
		{
			text: 'My Profile',
			icon: <AccountCircleOutlinedIcon color="primary" />,
			path: '/myprofile'
		},
		{
			text: 'Students',
			icon: <SchoolOutlined color="primary" />,
			path: '/students'
		},
		{
			text: 'Courses',
			icon: <AddToPhotosIcon color="primary" />,
			path: '/courses'
		},
		{
			text: 'Logout',
			icon: <LogoutOutlinedIcon color="primary" />,
			path: '/logout'
		}

	]

  return (
    <div className={classes.root}>
			
			{/* list / links */}
			<Drawer
				className={classes.drawer}
				variant="permanent"
				anchor="left"
				classes={{ paper: classes.drawerPaper }}
			>
				<List>
					{menuItems.map(item => (
						<ListItem 
							key={item.text}
							button
							onClick={() => navigate(item.path)}
							className={location.pathname === item.path ? classes.active : null}
						>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText primary={item.text}></ListItemText>
						</ListItem>
					))}
				</List>
			</Drawer>

			<div className={classes.page}>
				{/* <div className={classes.toolbar}></div> */}
				{children}
			</div>
		</div>
  )
}

import React, { useState } from 'react'
import { makeStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const courseOptions = [
  'Edit Course',
  'Drop Course',
  'Class List',
];

const ITEM_HEIGHT = 20;

export default function EnrolledCourseCard({ course, handleAction }) {
  const [selectedOption, setSelectedOption] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMoreIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuItemClose = (event) => {
    // get the selected option
    const { courseOption } = event.currentTarget.dataset;
    setAnchorEl(null);
    handleAction(course, courseOption);
  };

  return (
    <Card elevation={4}>
			<CardHeader
				// avatar={
				// 	<Avatar>
				// 		{course.courseName[0].toUpperCase()}
				// 	</Avatar>
				// }
				title={course.courseCode}
				subheader={course.courseName}
        action={
          // <IconButton onClick={() => console.log('drop course -> ', course.courseCode)}>
          <IconButton
            // aria-controls={open ? 'course-menu' : undefined}
            // aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleMoreIconClick}
          >
            <MoreVertIcon />
          </IconButton>
        }
			/>

      <Menu
        id="course-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuItemClose}
      >
        {courseOptions.map(option => (
          <MenuItem data-course-option={option} key={option} onClick={handleMenuItemClose}>{ option }</MenuItem>
        ))}
      </Menu>
      <CardContent>
        <Typography variant="body2" color="textSecondary">
          Semester: {course.semester}<br />
          Section: {course.section}
        </Typography>
      </CardContent>
    </Card>
  )
}

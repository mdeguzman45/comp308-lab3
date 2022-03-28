import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { Avatar, DialogActions } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

export default function CourseCard({ course, handleAction }) {

  // for MoreVertIcon
  const [anchorEl, setAnchorEl] = React.useState(null);
  const options = ["Enroll", "Class List"];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    const { courseOption } = event.currentTarget.dataset;
    console.log(course.courseCode);
    console.log(courseOption);
    setAnchorEl(null);
    handleAction(course, courseOption);
  };
  
  const open = Boolean(anchorEl);

  // end of - for MoreVertIcon

  return (
    <div>
      <Card elevation={1}>
        <CardHeader
          avatar={<Avatar>{course.courseName[0].toUpperCase()}</Avatar>}
          title={course.courseCode}
          subheader={course.courseName}
          action={
            <IconButton
              aria-label="more"
              onClick={handleClick}
              aria-haspopup="true"
              aria-controls="long-menu"
            >
              <MoreVertIcon />
            </IconButton>
          }
        />
      </Card>

      <Menu anchorEl={anchorEl} keepMounted onClose={handleClose} open={open}>
        {options.map((option) => (
          <MenuItem
            key={option}
            data-course-option={option}
            onClick={handleClose}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

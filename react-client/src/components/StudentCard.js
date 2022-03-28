import React from 'react'
import { makeStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Avatar, Typography } from '@mui/material';

export default function StudentCard({ student }) {
	const fullName = `${student.firstName} ${student.lastName}`

  return (
    <Card elevation={1}>
			<CardHeader
				avatar={
					<Avatar>
						{student.firstName[0].toUpperCase()}
					</Avatar>
				}
				title={student.studentNumber}
				subheader={fullName}
			/>
    </Card>
  )
}

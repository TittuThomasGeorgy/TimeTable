import { Avatar, Chip, Typography } from '@mui/material';
import React from 'react'
import type { ITeacher } from '../types/Teacher';
import { useNavigate } from 'react-router-dom';

interface Props{
    value:ITeacher;
    
}
const TeacherChip = (props:Props) => {
    const navigate=useNavigate();
    return (
        <Chip avatar={<Avatar aria-label="" src={props.value?.image} sx={{ height: 30, width: 30 }} />}
            onClick={(e) => {
                e.stopPropagation();
                navigate(`/teacher/${props.value?._id}`)
            }}
            label={<Typography variant="body1">{props.value?.name}</Typography>} />
    )
}

export default TeacherChip
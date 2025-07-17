// import React from 'react'
import { Button, List, ListItem, Typography } from '@mui/material'
import CommonPageLayout from '../../../layouts/CommonPageLayout'
import { Add as AddIcon } from '@mui/icons-material';
import { useState } from 'react';
import AddTeacherDialog from '../components/AddTeacherDialog';
import type { ITeacher } from '../types/Teacher';
import { useGetTeachers } from '../hooks/useTeacher';
import { useNavigate } from 'react-router-dom';

const TeacherPage = () => {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const { data: res, isLoading } = useGetTeachers();
    const teachers = res?.data;
    return (

        <CommonPageLayout title='Teachers'>
            <Button
                variant="contained"
                color="primary"
                sx={{ textTransform: 'none', float: 'right' }}
                startIcon={<AddIcon />}
                onClick={() => setOpen(true)}
            >
                ADD
            </Button>
            {isLoading ? (
                <Typography>Loading teachers...</Typography>
            ) : (
                <List>
                    {teachers?.map((teacher) => (
                        <ListItem key={teacher._id}
                            onClick={() => navigate(`/teacher/${teacher._id}`)}
                        >
                            {teacher.name} - {teacher.code}</ListItem>
                    ))}
                </List>
            )}
            <AddTeacherDialog open={open}
                onClose={() => setOpen(false)}
                onSubmit={function (value: ITeacher): void {
                    console.log(value);

                }}
            />
        </CommonPageLayout>
    )
}

export default TeacherPage
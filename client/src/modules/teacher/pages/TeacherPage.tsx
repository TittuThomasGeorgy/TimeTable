// import React from 'react'
import { Button, Typography, Grid } from '@mui/material'
import CommonPageLayout from '../../../layouts/CommonPageLayout'
import { Add as AddIcon } from '@mui/icons-material';
import { useState } from 'react';
import AddTeacherDialog from '../components/AddTeacherDialog';
import type { ITeacher } from '../types/Teacher';
import { useGetTeachers } from '../hooks/useTeacher';
import TeacherCard from '../components/TeacherCard';

const TeacherPage = () => {
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
                onClick={() => {
                    console.log("clicked");
                    setOpen(true)
                }
                }
            >                ADD
            </Button>
            <br />
            <Grid container spacing={1}>

                {
                    isLoading ? (
                        <Typography>Loading teachers...</Typography>
                    ) : (
                        teachers?.map((teacher, index) => (
                            <Grid
                                size={{ xs: 12, md: 3 }}

                            >
                                <TeacherCard value={teacher} key={index} />

                            </Grid>

                        ))

                    )
                }
            </Grid>
            <AddTeacherDialog open={open}
                onClose={() => setOpen(false)}
                onSubmit={function (value: ITeacher): void {
                    console.log(value);

                }}
            />
        </CommonPageLayout >
    )
}

export default TeacherPage
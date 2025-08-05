// import React from 'react'
import { Button, Typography, Grid, Divider } from '@mui/material'
import CommonPageLayout from '../../../layouts/CommonPageLayout'
import { Add as AddIcon } from '@mui/icons-material';
import { useState } from 'react';
import AddTeacherDialog from '../components/AddTeacherDialog';
import type { ITeacher } from '../types/Teacher';
import { useGetTeachers } from '../hooks/useTeacher';
import TeacherCard from '../components/TeacherCard';
import AddSubjectDialog from '../../subject/components/AddSubjectDialog';
import type { ISubject } from '../../subject/types/Subject';

const TeacherPage = () => {
    const [openAddTeacher, setOpenAddTeacher] = useState(false);
    const [openAddSubject, setOpenAddSubject] = useState(false);
    const { data: res, isLoading } = useGetTeachers();
    const teachers = res?.data;
    return (

        <CommonPageLayout >
            <Grid container spacing={0}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h4">Teachers
                    </Typography>

                </Grid>
                <Grid size={{ xs: 12, md: 6 }} sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setOpenAddTeacher(true)
                        }
                        }
                    >                ADD
                    </Button>
                </Grid>
            </Grid>
            <Divider /> <br />
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
            <AddSubjectDialog open={openAddSubject}
                onClose={() => setOpenAddSubject(false)}
                onSubmit={function (value: ISubject): void {
                    console.log(value);
                }}
            />
            <AddTeacherDialog open={openAddTeacher}
                onClose={() => setOpenAddTeacher(false)}
                onSubmit={function (value: ITeacher): void {
                    console.log(value);

                }}
                onAddSubject={() => setOpenAddSubject(true)}

            />
        </CommonPageLayout >
    )
}

export default TeacherPage
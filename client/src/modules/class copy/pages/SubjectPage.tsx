// import React from 'react'
import { Button, Typography, Grid } from '@mui/material'
import CommonPageLayout from '../../../layouts/CommonPageLayout'
import { Add as AddIcon } from '@mui/icons-material';
import { useState } from 'react';
import type { ISubject } from '../types/Subject';
import { useGetSubjects } from '../hooks/useSubject';
import SubjectCard from '../components/SubjectCard';
import AddSubjectDialog from '../components/AddSubjectDialog';


const SubjectPage = () => {
    const [open, setOpen] = useState(false);
    const { data: res, isLoading } = useGetSubjects();
    const subjects = res?.data;
    return (

        <CommonPageLayout title='Subjects'>
            <Button
                variant="contained"
                color="primary"
                sx={{ textTransform: 'none', float: 'right' }}
                startIcon={<AddIcon />}
                onClick={() => {
                    setOpen(true)
                }
                }
            >                ADD
            </Button>
            <br />
            <Grid container spacing={1}>

                {
                    isLoading ? (
                        <Typography>Loading Subjects...</Typography>
                    ) : (
                        subjects?.map((_class, index) => (
                            <Grid
                                size={{ xs: 6, md: 2 }}

                            >
                                <SubjectCard value={_class} key={index} />

                            </Grid>

                        ))

                    )
                }
            </Grid>
            <AddSubjectDialog open={open}
                onClose={() => setOpen(false)}
                onSubmit={function (value: ISubject): void {
                    console.log(value);

                }}
            />
        </CommonPageLayout >
    )
}

export default SubjectPage
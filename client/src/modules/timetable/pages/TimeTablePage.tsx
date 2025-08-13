// import React from 'react'
import { Button, Divider, Grid, Typography } from '@mui/material';
import CommonPageLayout from '../../../layouts/CommonPageLayout'
import { Add as AddIcon } from '@mui/icons-material';
import AddTimetableDialog from '../components/AddTimetableDialog';
import { useState } from 'react';
import { useGetTimetables } from '../hooks/useTimetable';
import type { ITimetable } from '../types/Timetable';
import TimetableCard from '../components/TimetableCard';

const TimeTablePage = () => {
    const [open, setOpen] = useState(false);
    const { data: res, isLoading } = useGetTimetables();
    const timetables = res?.data;
    return (

        <CommonPageLayout>
            <Grid container spacing={0}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h4">TimeTables
                    </Typography>

                </Grid>
                <Grid size={{ xs: 12, md: 6 }} sx={{ p: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setOpen(true)
                        }
                        }
                    >                ADD
                    </Button>
                </Grid>
            </Grid>
            <Divider /> <br />

            {/* <br /> */}
        <Grid container spacing={1}>

                {
                    isLoading ? (
                        <Typography>Loading Timetables...</Typography>
                    ) : (
                        timetables?.map((_timetable, index) => (
                            <Grid
                                size={{ xs: 6, md: 2 }}

                            >
                                <TimetableCard value={_timetable} key={index} />

                            </Grid>

                        ))

                    )
                }
            </Grid>
         
            <AddTimetableDialog open={open}
                onClose={() => setOpen(false)}
                onSubmit={function (value: ITimetable): void {
                    throw new Error('Function not implemented.');
                }}
            />
        </CommonPageLayout >
    )
}

export default TimeTablePage

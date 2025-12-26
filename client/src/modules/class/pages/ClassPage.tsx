// import React from 'react'
import { Button, Typography, Grid, Divider } from '@mui/material'
import CommonPageLayout from '../../../layouts/CommonPageLayout'
import { Add as AddIcon } from '@mui/icons-material';
import { useState } from 'react';
import AddClassDialog from '../components/AddClassDialog';
import type { IClass } from '../types/Class';
import { useGetClasses } from '../hooks/useClass';
import ClassCard from '../components/ClassCard';



const ClassPage = () => {
    const [open, setOpen] = useState(false);
    const { data: res, isLoading } = useGetClasses();
    const classes = res?.data;
    return (

        <CommonPageLayout >
                    <Grid container spacing={0}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h4">Class
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
            <Grid container spacing={1}>

                {
                    isLoading ? (
                        <Typography>Loading teachers...</Typography>
                    ) : (
                        classes?.map((_class, index) => (
                            <Grid
                                size={{ xs: 6, md: 2 }}

                            >
                                <ClassCard value={_class} key={index} />

                            </Grid>

                        ))

                    )
                }
            </Grid>
            <AddClassDialog open={open}
                onClose={() => setOpen(false)}
                onSubmit={function (value: IClass): void {
                    console.log(value);

                }}
            />
        </CommonPageLayout >
    )
}

export default ClassPage

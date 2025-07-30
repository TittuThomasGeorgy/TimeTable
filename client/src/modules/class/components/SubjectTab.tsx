import { Button, Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Add as AddIcon } from '@mui/icons-material';
import AddClassSubjectDialog from './AddClassSubjectDialog';
import type { IClassSubject } from '../types/ClassSubject';
import { useGetClassSubjects } from '../hooks/useClassSubject';
import ClassSubCard from './classSubCard';

interface Props {
    classId: string;
}

const SubjectTab = (props: Props) => {
    const { data: res, isLoading } = useGetClassSubjects(props.classId);
    const classSubjects = res?.data;

    const [openAddSubjects, setOpenAddSubjects] = useState<{
        action: 'add' | 'edit',
        open: boolean
    }>({
        action: 'add',
        open: false,
    });


    return (
        <>

            <Button
                variant="contained"
                color="primary"
                sx={{ textTransform: 'none', float: 'right', mt: .5 }}
                startIcon={<AddIcon />}
                onClick={() => {
                    setOpenAddSubjects({
                        action: 'add',
                        open: true
                    })
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
                        classSubjects?.map((sub, index) => (
                            <Grid
                                size={{ xs: 6, md: 2 }}

                            >
                                <ClassSubCard value={sub} key={index} />

                            </Grid>

                        ))

                    )
                }
            </Grid>
            <AddClassSubjectDialog classId={props.classId}
                open={openAddSubjects.open}
                onClose={() => setOpenAddSubjects({
                    action: 'add',
                    open: false,
                })}
                onSubmit={function (value: IClassSubject): void {
                    console.log(value);

                }}
            />
        </>
    )
}

export default SubjectTab
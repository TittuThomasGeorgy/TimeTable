import { Button, Grid, Typography } from '@mui/material'
import { useState } from 'react'
import { Add as AddIcon } from '@mui/icons-material';
import AddClassSubjectDialog from './AddClassSubjectDialog';
import type { IClassSubject } from '../types/ClassSubject';
import { useGetClassSubjects } from '../hooks/useClassSubject';
import ClassSubCard from './ClassSubCard';
import type { ISubject } from '../../subject/types/Subject';
import type { ITeacher } from '../../teacher/types/Teacher';
import AddSubjectDialog from '../../subject/components/AddSubjectDialog';
import AddTeacherDialog from '../../teacher/components/AddTeacherDialog';

interface Props {
    classId: string;
}

const SubjectTab = (props: Props) => {
    const { data: res, isLoading } = useGetClassSubjects(props.classId,'class');
    const classSubjects = res?.data;

    const [openAddTeacher, setOpenAddTeacher] = useState(false);
    const [openAddSubject, setOpenAddSubject] = useState(false);
    const [openAddSubjects, setOpenAddSubjects] = useState<{
        open: boolean
        value: null | IClassSubject
    }>({
        open: false,
        value: null,
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
                        open: true, value: null
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
                                <ClassSubCard value={sub} key={index} onEdit={() => setOpenAddSubjects({
                                    value: { ...sub, subject: (sub.subject as ISubject)._id, teacher: (sub.teacher as ITeacher)._id }, open: true
                                })} type='class' />

                            </Grid>

                        ))

                    )
                }
            </Grid>
            <AddClassSubjectDialog classId={props.classId}
                open={openAddSubjects.open}
                onClose={() => setOpenAddSubjects({
                    value: null,
                    open: false,
                })}
                onSubmit={function (value: IClassSubject): void {
                    console.log(value);

                }}
                onAddSubject={() => setOpenAddSubject(true)}
                onAddTeacher={() => setOpenAddTeacher(true)}
                value={openAddSubjects.value}
            />
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
        </>
    )
}

export default SubjectTab
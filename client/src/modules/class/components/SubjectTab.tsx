import { Button, Grid, Typography } from '@mui/material'
import { useState } from 'react'
import { Add as AddIcon, Download as DownloadIcon } from '@mui/icons-material';
import AddClassSubjectDialog from './AddClassSubjectDialog';
import type { IClassSubject } from '../types/ClassSubject';
import { useDeleteClassSubject, useGetClassSubjects } from '../hooks/useClassSubject';
import ClassSubCard from './ClassSubCard';
import type { ISubject } from '../../subject/types/Subject';
import type { ITeacher } from '../../teacher/types/Teacher';
import AddSubjectDialog from '../../subject/components/AddSubjectDialog';
import AddTeacherDialog from '../../teacher/components/AddTeacherDialog';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import ImportClassSubjectDialog from './ImportClassSubjectDialog';

interface Props {
    classId: string;
    classSubjects: IClassSubject[];
    isLoading:boolean
}

const SubjectTab = (props: Props) => {

    const { mutate: deleteClassSubject } = useDeleteClassSubject()

    const [openAddTeacher, setOpenAddTeacher] = useState(false);
    const [openAddSubject, setOpenAddSubject] = useState(false);
    const [importSubjects, setImportSubjects] = useState(false);
    const [openAddSubjects, setOpenAddSubjects] = useState<{
        open: boolean
        value: null | IClassSubject
    }>({
        open: false,
        value: null,
    });
    const [confirmDelete, setConfirmDelete] = useState<null | IClassSubject>(null)
    const handleDelete = (id: string) => {
        deleteClassSubject(id);
    }

    return (
        <>


            <Button
                variant="contained"
                color="primary"
                sx={{ textTransform: 'none', float: 'right', }}
                startIcon={<AddIcon />}
                onClick={() => {
                    setOpenAddSubjects({
                        open: true, value: null
                    })
                }
                }
            >                ADD
            </Button>
            <Button
                variant="contained"
                color="primary"
                sx={{ textTransform: 'none', float: 'right', mr: .5 }}
                startIcon={<DownloadIcon />}
                onClick={() => {
                    setImportSubjects(true)
                }
                }
            >                IMPORT
            </Button>
            <br />
            <br />
            <Grid container spacing={1}>

                {
                   props.isLoading ? (
                        <Typography>Loading Subjects...</Typography>
                    ) : (
                        props.classSubjects?.map((sub, index) => (
                            <Grid
                                size={{ xs: 6, md: 2 }}
                                key={index}
                            >
                                <ClassSubCard value={sub} key={index}
                                    onEdit={() => setOpenAddSubjects({
                                        value: { ...sub, subject: (sub.subject as ISubject)._id, teacher: (sub.teacher as ITeacher)._id }, open: true
                                    })}
                                    onDelete={() => setConfirmDelete(sub)}
                                    type='class'
                                    options />

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
            <ImportClassSubjectDialog
                classId={props.classId}
                open={importSubjects}
                onClose={() => setImportSubjects(false)}
            />
            {confirmDelete && <ConfirmationDialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}
                onConfirm={() => handleDelete(confirmDelete?._id ?? '')} title={`Are You sure want to Delete Class Subject ${(confirmDelete?.subject as ISubject).name}?`} />}
        </>
    )
}

export default SubjectTab
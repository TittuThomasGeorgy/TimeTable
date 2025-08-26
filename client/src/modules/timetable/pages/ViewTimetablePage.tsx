import { useState } from 'react'
import CommonPageLayout from '../../../layouts/CommonPageLayout'
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Grid, Button, Divider,  Box } from '@mui/material';
import {  Delete as DeleteIcon, Edit as EditIcon, Repeat as RepeatIcon } from '@mui/icons-material';
import { useDeleteTimetable, useGetTimetableById } from '../hooks/useTimetable';
import AddTimetableDialog from '../components/AddTimetableDialog';
import type { ITimetable } from '../types/Timetable';
import { useGetPeriods, useShufflePeriods } from '../hooks/usePeriods';
import { useGetClasses } from '../../class/hooks/useClass';
import classList from '../../class/constants/ClassList.default';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import TimetableGrid from '../components/TimetableGrid';
import { useGetTeachers } from '../../teacher/hooks/useTeacher';
import { useGetSubjects } from '../../subject/hooks/useSubject';
import { useGetAllClassSubjects } from '../../class/hooks/useClassSubject';
import type { IClassSubject } from '../../class/types/ClassSubject';
import { useGetRemarks } from '../hooks/useRemarks';
import RemarkDrawer from '../components/RemarkDialog';

const ViewTimetablePage = () => {
    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>(); // Specify the type for useParams
    const [open, setOpen] = useState(false);

    // Ensure id is present before making the API call
    const { data: timetableRes, isLoading, isError, error } = useGetTimetableById(id || ''); // Pass an empty string if id is undefined to satisfy type, or handle in hook
    const { data: periodRes, isLoading: isPeriodsLoading } = useGetPeriods(id || ''); // Pass an empty string if id is undefined to satisfy type, or handle in hook
    const { mutate: deleteTimetable } = useDeleteTimetable()
    const { mutate: shuffleTimetable } = useShufflePeriods()
    const { data: clzRes, isLoading: isClassLoading } = useGetClasses();
    const { data: teacherRes } = useGetTeachers();
    const { data: subjectRes } = useGetSubjects();
    const { data: classSubjectRes } = useGetAllClassSubjects();
    const { data: remarksRes } = useGetRemarks(id || '');
    const subjects = subjectRes?.data;
    const teachers = teacherRes?.data;
    const classSubjects = classSubjectRes?.data;
    const periods = periodRes?.data;
    const classes = clzRes?.data;
    const timetable = timetableRes?.data;
    const remarks = remarksRes?.data;

    const [confirmDelete, setConfirmDelete] = useState(false)
    const [selectedSubject, setSelectedSubject] = useState<IClassSubject | null>(null)


    const handleDelete = () => {
        deleteTimetable(id ?? '');
        navigate(-1)
    }
    const reshuffle = () => {
        shuffleTimetable(id ?? '');
    }

    // 3. Now, use the values from the hooks in your conditional rendering
    if (!id) {
        // This condition checks the ID *after* the hooks are called.
        // If the ID is truly missing from the URL, you handle it here.
        return <div>Error: Subject ID not found in URL. Please check the URL.</div>;
    }


    return (
        <CommonPageLayout>
            {isLoading &&
                <div>Loading Subject details...</div>
            }
            {isPeriodsLoading &&
                <div>Loading Period details...</div>
            }
            {isClassLoading &&
                <div>Loading Class details...</div>
            }
            {isError &&
                <div>Error fetching class: {error?.message || 'Unknown error'}</div>
            }
            <Grid container spacing={0}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h4">{timetable?.name}
                    </Typography>

                </Grid>
                <Grid size={{ xs: 12, md: 6 }} sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="outlined" color="primary" onClick={() => reshuffle()} startIcon={<RepeatIcon />}>
                        Reshuffle
                    </Button>
                    <Button variant="outlined" color="primary" onClick={() => setOpen(true)} startIcon={<EditIcon />}>
                        Edit
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => setConfirmDelete(true)} startIcon={<DeleteIcon />}>
                        Delete
                    </Button>
                </Grid>
            </Grid>
            <Divider /> <br />

            {
                classes?.map((clz, indx) =>
                    <Box key={indx}>
                        <Typography variant="body1" color="initial" textAlign={'center'} sx={{ mt: .5, mb: .5 }}> {classList[clz.name]} {clz.div}
                        </Typography>

                        <TimetableGrid
                            periods={periods?.filter(period => period.class == clz._id) ?? []}
                            classSubjects={classSubjects ?? []}
                            teachers={teachers ?? []}
                            subjects={subjects ?? []}
                            selectedClassSubject={selectedSubject?._id ?? ''}
                            onSelectClassSubject={(selected) => setSelectedSubject(classSubjects?.find(clzSub => clzSub._id === selected) ?? null)} />
                    </Box>
                )
            }
            {selectedSubject && (() => {
                const sub = subjects?.find(s => s._id === selectedSubject.subject);
                const teacher = teachers?.find(s => s._id === selectedSubject.teacher);
                const noOfHours = periods?.filter(per => per.classSubject == selectedSubject._id).length;
                const _remarks = remarks?.filter(rem => rem.classSubject == selectedSubject._id) ?? []
                return (
                    sub && teacher && <RemarkDrawer
                        open={!!selectedSubject}
                        onClose={() => setSelectedSubject(null)}
                        subject={sub}
                        teacher={teacher}
                        noOfHours={noOfHours ?? 0}
                        totalNoOfHours={selectedSubject.noOfHours}
                        remarks={_remarks}
                    />
                );
            })()}
            <AddTimetableDialog open={open} onClose={() => setOpen(false)}
                value={timetable}
                onSubmit={function (value: ITimetable): void {
                    console.log(value);

                }}
            />
            {confirmDelete && <ConfirmationDialog open={confirmDelete} onClose={() => setConfirmDelete(false)}
                onConfirm={() => handleDelete()} title={`Are You sure want to Delete timetable ${timetable?.name}?`} />}


        </CommonPageLayout >
    )
}

export default ViewTimetablePage
import { useState } from 'react'
import CommonPageLayout from '../../../layouts/CommonPageLayout'
import { useGetTeacherById } from '../hooks/useTeacher';
import { useParams } from 'react-router-dom';
import { Container, Card, CardHeader, Typography, Avatar, CardContent, Grid, Chip, Box, Button, Divider } from '@mui/material';
import { Person as PersonIcon, Subject } from '@mui/icons-material';
import AddTeacherDialog from '../components/AddTeacherDialog';
import type { ITeacher } from '../types/Teacher';
import { useGetSubjectById } from '../../subject/hooks/useSubject';
import AddSubjectDialog from '../../subject/components/AddSubjectDialog';
import type { ISubject } from '../../subject/types/Subject';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import ClassSubCard from '../../class/components/ClassSubCard';
import { useGetClassSubjects } from '../../class/hooks/useClassSubject';

const ViewTeacherPage = () => {
    const { id } = useParams<{ id: string }>(); // Specify the type for useParams
    const [open, setOpen] = useState(false);
    const [openAddSubject, setOpenAddSubject] = useState(false);

    // Ensure id is present before making the API call
    const { data: res, isLoading, isError, error } = useGetTeacherById(id || ''); // Pass an empty string if id is undefined to satisfy type, or handle in hook
    const teacher = res?.data;
    const { data: resSub, isLoading: isLoadingSub, isError: isErrorSub, error: errorSub } = useGetSubjectById(teacher?.subject || ''); // Pass an empty string if id is undefined to satisfy type, or handle in hook
    const subject = resSub?.data;
    // 3. Now, use the values from the hooks in your conditional rendering
    const { data: classSubs, isLoading: isLoadingClassSubs } = useGetClassSubjects(id || '', 'teacher');
    const classSubjects = classSubs?.data;
    if (!id) {
        // This condition checks the ID *after* the hooks are called.
        // If the ID is truly missing from the URL, you handle it here.
        return <div>Error: Teacher ID not found in URL. Please check the URL.</div>;
    }



    return (
        <CommonPageLayout>
            {isLoading &&
                <div>Loading teacher? details...</div>
            }
            {isError &&
                <div>Error fetching teacher?: {error?.message || 'Unknown error'}</div>
            }
            {!teacher &&
                <div>No teacher? found with ID: {id}</div>
            }
            <Grid container spacing={2} alignItems="center">
                {/* Avatar Section */}
                <Grid size={{ xs: 12, md: 1 }} container justifyContent={{ xs: 'center', md: 'flex-start' }}>
                    {teacher?.image ? (
                        <Avatar alt={teacher?.name} src={teacher?.image} sx={{ width: 70, height: 70 }} />
                    ) : (
                        <Avatar sx={{ bgcolor: 'primary.main', width: 70, height: 70 }}>
                            <PersonIcon fontSize="large" />
                        </Avatar>
                    )}
                </Grid>

                {/* Teacher Details Section */}
                <Grid size={{ xs: 12, md: 11 }}>
                    <Grid container spacing={1}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box display="flex" gap={1}>
                                <Typography variant="subtitle1" color="text.secondary">Name:</Typography>
                                <Typography variant="body1">{teacher?.name}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box display="flex" gap={1}>
                                <Typography variant="subtitle1" color="text.secondary">Username:</Typography>
                                <Typography variant="body1">{teacher?.username}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box display="flex" gap={1}>
                                <Typography variant="subtitle1" color="text.secondary">Code:</Typography>
                                <Typography variant="body1">{teacher?.code}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box display="flex" gap={1}>
                                <Typography variant="subtitle1" color="text.secondary">Subject:</Typography>
                                <Typography variant="body1">
                                    {isLoadingSub || isErrorSub ? "..." : subject?.name || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box display="flex" gap={1} alignItems="center">
                                <Typography variant="subtitle1" color="text.secondary">Admin Status:</Typography>
                                <Chip
                                    label={teacher?.isAdmin ? "Administrator" : "Standard User"}
                                    color={teacher?.isAdmin ? "success" : "default"}
                                    variant="outlined"
                                />
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box display="flex" gap={1}>
                                <Typography variant="subtitle1" color="text.secondary">Experience (Exp):</Typography>
                                <Typography variant="body1">
                                    {teacher?.exp && teacher.exp > 0 ? `${teacher?.exp} years` : 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Buttons Section */}
                <Grid size={{ xs: 12 }}>
                    <Box display="flex" justifyContent={{ xs: 'center', md: 'flex-end' }} gap={1}>
                        <Button variant="outlined" color="primary" onClick={() => setOpen(true)} startIcon={<EditIcon />}>
                            Edit
                        </Button>
                        <Button variant="outlined" color="error" onClick={() => console.log('Delete clicked')} startIcon={<DeleteIcon />}>
                            Delete
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <Divider /> <br />
            <Grid container spacing={1}>

                {
                    isLoading ? (
                        <Typography>Loading Classes...</Typography>
                    ) : (
                        classSubjects?.map((sub, index) => (
                            <Grid
                                size={{ xs: 6, md: 2 }}

                            >
                                <ClassSubCard value={sub} key={index} type='teacher' />

                            </Grid>

                        ))

                    )
                }
            </Grid>
            <AddTeacherDialog open={open} onClose={() => setOpen(false)}
                value={teacher}
                onSubmit={function (value: ITeacher): void {
                    console.log(value);

                }}
                onAddSubject={() => setOpenAddSubject(true)}

            />
            <AddSubjectDialog open={openAddSubject}
                onClose={() => setOpenAddSubject(false)}
                onSubmit={function (value: ISubject): void {
                    console.log(value);
                }}
            />

        </CommonPageLayout>
    )
}

export default ViewTeacherPage
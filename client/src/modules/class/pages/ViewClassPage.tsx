import { useState } from 'react'
import CommonPageLayout from '../../../layouts/CommonPageLayout'
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Card, CardHeader, Typography, Avatar, CardContent, Grid, Chip, Box, Button } from '@mui/material';
import { Person } from '@mui/icons-material';
import AddClassDialog from '../components/AddClassDialog';
import type { IClass } from '../types/Class';
import { useGetClassById } from '../hooks/useClass';
import { useGetTeacherById } from '../../teacher/hooks/useTeacher';

const ViewClassPage = () => {
    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>(); // Specify the type for useParams
    const [open, setOpen] = useState(false);

    // Ensure id is present before making the API call
    const { data: res, isLoading, isError, error } = useGetClassById(id || ''); // Pass an empty string if id is undefined to satisfy type, or handle in hook
    const _class = res?.data;

    // 3. Now, use the values from the hooks in your conditional rendering
    if (!id) {
        // This condition checks the ID *after* the hooks are called.
        // If the ID is truly missing from the URL, you handle it here.
        return <div>Error: Teacher ID not found in URL. Please check the URL.</div>;
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data: res1, isLoading: isLoading1, isError: isError1, error: error1 } = useGetTeacherById(_class?.classTeacher || ''); // Pass an empty string if id is undefined to satisfy type, or handle in hook
    const teacher = res1?.data;


    return (
        <CommonPageLayout>
            {isLoading &&
                <div>Loading class details...</div>
            }
            {isError &&
                <div>Error fetching class: {error?.message || 'Unknown error'}</div>
            }
            {!_class &&
                <div>No class found with ID: {id}</div>
            }
            {isLoading1 &&
                <div>Loading classTeacher details...</div>
            }
            {isError1 &&
                <div>Error fetching class Teacher: {error1?.message || 'Unknown error'}</div>
            }
            {_class?.classTeacher && !teacher &&
                <div>No class teacher with ID: {id}</div>
            }
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Card sx={{ boxShadow: 3 }}>
                    <CardHeader
                        title={
                            <Typography variant="h5" component="div">
                                Class Details
                            </Typography>
                        }

                        sx={{ bgcolor: 'primary.main', color: 'white' }}
                    />
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle1" color="text.secondary">Name:</Typography>
                                <Typography variant="body1">{_class?.name}</Typography>
                            </Grid>
                            {teacher &&
                                <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'row' }}>
                                    <Typography variant="subtitle1" color="text.secondary">Class Teacher:</Typography>
                                    <Chip avatar={<Avatar aria-label="" src={teacher?.image} sx={{ height: 30, width: 30 }} />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/teacher/${teacher?._id}`)
                                        }}
                                        label={<Typography variant="body1">{teacher?.name}</Typography>} />

                                </Grid>}

                        </Grid>


                    </CardContent>
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>
                            Edit
                        </Button>
                        <Button variant="outlined" color="error" onClick={() => console.log('Delete clicked')}>
                            Delete
                        </Button>
                    </Box>
                </Card>
            </Container>
            <AddClassDialog open={open} onClose={() => setOpen(false)}
                value={_class}
                onSubmit={function (value: IClass): void {
                    console.log(value);

                }}
            />

        </CommonPageLayout>
    )
}

export default ViewClassPage
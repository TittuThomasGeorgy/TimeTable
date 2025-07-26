import { useState } from 'react'
import CommonPageLayout from '../../../layouts/CommonPageLayout'
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Card, CardHeader, Typography, Avatar, CardContent, Grid, Chip, Box, Button } from '@mui/material';
import AddSubjectDialog from '../components/AddSubjectDialog';
import { useGetTeacherById } from '../../teacher/hooks/useTeacher';
import type { ISubject } from '../types/Subject';
import { useGetSubjectById } from '../hooks/useSubject';

const ViewSubjectPage = () => {
    // const navigate = useNavigate();

    const { id } = useParams<{ id: string }>(); // Specify the type for useParams
    const [open, setOpen] = useState(false);

    // Ensure id is present before making the API call
    const { data: res, isLoading, isError, error } = useGetSubjectById(id || ''); // Pass an empty string if id is undefined to satisfy type, or handle in hook
    const subject = res?.data;

    // 3. Now, use the values from the hooks in your conditional rendering
    if (!id) {
        // This condition checks the ID *after* the hooks are called.
        // If the ID is truly missing from the URL, you handle it here.
        return <div>Error: Subject ID not found in URL. Please check the URL.</div>;
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks


    return (
        <CommonPageLayout>
            {isLoading &&
                <div>Loading Subject details...</div>
            }
            {isError &&
                <div>Error fetching class: {error?.message || 'Unknown error'}</div>
            }
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Card sx={{ boxShadow: 3 }}>
                    <CardHeader
                        title={
                            <Typography variant="h5" component="div">
                                Subject Details
                            </Typography>
                        }

                        sx={{ bgcolor: 'primary.main', color: 'white' }}
                    />
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle1" color="text.secondary">Name:</Typography>
                                <Typography variant="body1">{subject?.name}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle1" color="text.secondary">Code:</Typography>
                                <Typography variant="body1">{subject?.code}</Typography>
                            </Grid>


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
            <AddSubjectDialog open={open} onClose={() => setOpen(false)}
                value={subject}
                onSubmit={function (value: ISubject): void {
                    console.log(value);

                }}
            />

        </CommonPageLayout >
    )
}

export default ViewSubjectPage
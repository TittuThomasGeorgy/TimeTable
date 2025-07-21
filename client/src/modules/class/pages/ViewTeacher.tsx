import { useState } from 'react'
import CommonPageLayout from '../../../layouts/CommonPageLayout'
import { useGetTeacherById } from '../hooks/useTeacher';
import { useParams } from 'react-router-dom';
import { Container, Card, CardHeader, Typography, Avatar, CardContent, Grid, Chip, Box, Button } from '@mui/material';
import { Person } from '@mui/icons-material';
import AddClassDialog from '../components/AddClassDialog';
import type { ITeacher } from '../types/Class';

const ViewTeacherPage = () => {
    const { id } = useParams<{ id: string }>(); // Specify the type for useParams
    const [open, setOpen] = useState(false);

    // Ensure id is present before making the API call
    const { data: res, isLoading, isError, error } = useGetTeacherById(id || ''); // Pass an empty string if id is undefined to satisfy type, or handle in hook
    const teacher = res?.data;
    // 3. Now, use the values from the hooks in your conditional rendering
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
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Card sx={{ boxShadow: 3 }}>
                    <CardHeader
                        title={
                            <Typography variant="h5" component="div">
                                Teacher Details
                            </Typography>
                        }
                        avatar={
                            teacher?.image ? (
                                <Avatar alt={teacher?.name} src={teacher?.image} sx={{ width: 56, height: 56 }} />
                            ) : (
                                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                                    <Person fontSize="large" />
                                </Avatar>
                            )
                        }
                        sx={{ bgcolor: 'primary.main', color: 'white' }}
                    />
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle1" color="text.secondary">Name:</Typography>
                                <Typography variant="body1">{teacher?.name}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle1" color="text.secondary">Username:</Typography>
                                <Typography variant="body1">{teacher?.username}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle1" color="text.secondary">Code:</Typography>
                                <Typography variant="body1">{teacher?.code}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle1" color="text.secondary">Admin Status:</Typography>
                                <Chip
                                    label={teacher?.isAdmin ? "Administrator" : "Standard User"}
                                    color={teacher?.isAdmin ? "success" : "default"}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle1" color="text.secondary">Experience (Exp):</Typography>
                                <Typography variant="body1">{teacher?.exp && teacher.exp > 0 ? `${teacher?.exp} years` : 'N/A'}</Typography>
                            </Grid>
                        </Grid>

                        {/* <Divider sx={{ my: 3 }} />

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">Created At:</Typography>
                                <Typography variant="body2">{new Date(teacher?.createdAt).toLocaleString()}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">Last Updated:</Typography>
                                <Typography variant="body2">{new Date(teacher?.updatedAt).toLocaleString()}</Typography>
                            </Grid>
                        </Grid> */}
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
                value={teacher}
                onSubmit={function (value: ITeacher): void {
                    console.log(value);

                }}
            />

        </CommonPageLayout>
    )
}

export default ViewTeacherPage
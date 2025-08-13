import { useState } from 'react'
import CommonPageLayout from '../../../layouts/CommonPageLayout'
import {  useParams } from 'react-router-dom';
import { Typography, Grid, Button, Divider } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useGetTimetableById } from '../hooks/useTimetable';
import AddTimetableDialog from '../components/AddTimetableDialog';
import type { ITimetable } from '../types/Timetable';

const ViewTimetablePage = () => {
    // const navigate = useNavigate();

    const { id } = useParams<{ id: string }>(); // Specify the type for useParams
    const [open, setOpen] = useState(false);

    // Ensure id is present before making the API call
    const { data: res, isLoading, isError, error } = useGetTimetableById(id || ''); // Pass an empty string if id is undefined to satisfy type, or handle in hook
    const timetable = res?.data;


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
            <Grid container spacing={0}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h4">{timetable?.name}
                    </Typography>

                </Grid>
                <Grid size={{ xs: 12, md: 6 }} sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="outlined" color="primary" onClick={() => setOpen(true)} startIcon={<EditIcon />}>
                        Edit
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => console.log('Delete clicked')} startIcon={<DeleteIcon />}>
                        Delete
                    </Button>
                </Grid>
            </Grid>
            <Divider /> <br />

            <AddTimetableDialog open={open} onClose={() => setOpen(false)}
                value={timetable}
                onSubmit={function (value: ITimetable): void {
                    console.log(value);

                }}
            />
            

        </CommonPageLayout >
    )
}

export default ViewTimetablePage
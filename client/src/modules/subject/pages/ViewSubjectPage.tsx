import { useState } from 'react'
import CommonPageLayout from '../../../layouts/CommonPageLayout'
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Grid, Button, Divider } from '@mui/material';
import AddSubjectDialog from '../components/AddSubjectDialog';
import type { ISubject } from '../types/Subject';
import { useGetSubjectById } from '../hooks/useSubject';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useGetClassSubjects } from '../../class/hooks/useClassSubject';
import ClassSubCard from '../../class/components/ClassSubCard';

const ViewSubjectPage = () => {
    // const navigate = useNavigate();

    const { id } = useParams<{ id: string }>(); // Specify the type for useParams
    const [open, setOpen] = useState(false);

    // Ensure id is present before making the API call
    const { data: res, isLoading, isError, error } = useGetSubjectById(id || ''); // Pass an empty string if id is undefined to satisfy type, or handle in hook
    const subject = res?.data;
    const { data: classSubs, isLoading:isLoadingClassSubs } = useGetClassSubjects(id || '', 'subject');
    const classSubjects = classSubs?.data;

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
                    <Typography variant="h4">{subject?.name}
                    </Typography>
                    <Typography variant="body2">{subject?.code}
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
            <Grid container spacing={1}>

                {
                    isLoading ? (
                        <Typography>Loading Classes...</Typography>
                    ) : (
                        classSubjects?.map((sub, index) => (
                            <Grid
                                size={{ xs: 6, md: 2 }}

                            >
                                <ClassSubCard value={sub} key={index}  type='subject' />

                            </Grid>

                        ))

                    )
                }
            </Grid>
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
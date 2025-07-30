import { useState } from 'react'
import CommonPageLayout from '../../../layouts/CommonPageLayout'
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Card, CardHeader, Typography, Avatar, CardContent, Grid, Chip, Box, Button, Divider, Tabs, Tab } from '@mui/material';
import AddClassDialog from '../components/AddClassDialog';
import type { IClass } from '../types/Class';
import { useGetClassById } from '../hooks/useClass';
import { useGetTeacherById } from '../../teacher/hooks/useTeacher';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import SubjectTab from '../components/SubjectTab';
import TeacherChip from '../../teacher/components/TeacherChip';

const ViewClassPage = () => {
    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>(); // Specify the type for useParams
    const [openEditClass, setOpenEditClass] = useState(false);

    const [value, setValue] = useState(0);

    // Ensure id is present before making the API call
    const { data: res, isLoading, isError, error } = useGetClassById(id || ''); // Pass an empty string if id is undefined to satisfy type, or handle in hook
    const _class = res?.data;


    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data: res1, isLoading: isLoading1, isError: isError1, error: error1 } = useGetTeacherById(_class?.classTeacher || ''); // Pass an empty string if id is undefined to satisfy type, or handle in hook
    const teacher = res1?.data;

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }
    // 3. Now, use the values from the hooks in your conditional rendering
    if (!id) {
        // This condition checks the ID *after* the hooks are called.
        // If the ID is truly missing from the URL, you handle it here.
        return <div>Error: Teacher ID not found in URL. Please check the URL.</div>;
    }
    return (
        <CommonPageLayout  >
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
            <Grid container spacing={0}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h4">CLASS: {
                        _class?.name}
                    </Typography>
                    {teacher &&
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            <Typography variant="subtitle1" color="text.secondary">Class Teacher:</Typography>
                            <TeacherChip value={teacher} />
                        </Box>}
                </Grid>
                <Grid size={{ xs: 12, md: 6 }} sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="outlined" color="primary" onClick={() => setOpenEditClass(true)} startIcon={<EditIcon />}>
                        Edit
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => console.log('Delete clicked')} startIcon={<DeleteIcon />}>
                        Delete
                    </Button>
                </Grid>
            </Grid>
            <Divider />
            <br />
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} >
                        <Tab label="Subjects" {...a11yProps(0)} />
                        <Tab label="Timetable" {...a11yProps(1)} />
                    </Tabs>
                    {value == 0 && <SubjectTab classId={id} />}

                </Box>

            </Box>
            <AddClassDialog open={openEditClass} onClose={() => setOpenEditClass(false)}
                value={_class}
                onSubmit={function (value: IClass): void {
                    console.log(value);

                }}
            />

        </CommonPageLayout>
    )
}

export default ViewClassPage
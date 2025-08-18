import { useState } from 'react'
import CommonPageLayout from '../../../layouts/CommonPageLayout'
import { useParams } from 'react-router-dom';
import { Typography, Grid, Button, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Close, Delete as DeleteIcon, Edit as EditIcon, RadioButtonChecked } from '@mui/icons-material';
import { useGetTimetableById } from '../hooks/useTimetable';
import AddTimetableDialog from '../components/AddTimetableDialog';
import type { ITimetable } from '../types/Timetable';
import { useGetPeriods } from '../hooks/usePeriods';
import { useGetClasses } from '../../class/hooks/useClass';
import classList from '../../class/constants/ClassList.default';
import type { Preferences } from '../../class/types/Preferences';
import {  daysList, periodsList } from '../constants/Day.default';
import type { IPeriod } from '../types/Period';

const ViewTimetablePage = () => {
    // const navigate = useNavigate();

    const { id } = useParams<{ id: string }>(); // Specify the type for useParams
    const [open, setOpen] = useState(false);

    // Ensure id is present before making the API call
    const { data: res, isLoading, isError, error } = useGetTimetableById(id || ''); // Pass an empty string if id is undefined to satisfy type, or handle in hook
    const timetable = res?.data;
    const { data: periodRes, isLoading: isPeriodsLoading } = useGetPeriods(id || ''); // Pass an empty string if id is undefined to satisfy type, or handle in hook
    const periods = periodRes?.data;
    const { data: clzRes, isLoading: isClassLoading } = useGetClasses();
    const classes = clzRes?.data;

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
                    <Button variant="outlined" color="primary" onClick={() => setOpen(true)} startIcon={<EditIcon />}>
                        Edit
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => console.log('Delete clicked')} startIcon={<DeleteIcon />}>
                        Delete
                    </Button>
                </Grid>
            </Grid>
            <Divider /> <br />
            {
                classes?.map(clz =>
                    <>
                        <Typography variant="body1" color="initial"> {classList[clz.name]} {clz.div}
                        </Typography>

                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        {periodsList.map(period => (
                                            <TableCell key={period} align="center">
                                                {period}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {daysList.map(day => (
                                        <TableRow key={day}>
                                            <TableCell>{day}</TableCell>
                                            {periodsList.map(period => {
                                                const _period: IPeriod|null = periods?.find(per => per.day === day && per.period === period && per.class===clz._id)??null
                                                return (
                                                    <TableCell
                                                        align="center"
                                                    >{
                                                        _period?.classSubject.toString()??'-'
                                                    }
                                                    </TableCell>



                                                )
                                            })}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )
            }
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
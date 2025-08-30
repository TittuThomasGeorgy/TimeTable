import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box, Typography, IconButton, Tooltip } from '@mui/material'
import { periodsList, daysList } from '../constants/Day.default'
import type { IPeriod } from '../types/Period'
import type { IClassSubject } from '../../class/types/ClassSubject';
import type { ITeacher } from '../../teacher/types/Teacher';
import type { ISubject } from '../../subject/types/Subject';
import PeriodCard from './PeriodCard';
import type { IClass } from '../../class/types/Class';
import classList from '../../class/constants/ClassList.default';
import { Repeat as RepeatIcon } from '@mui/icons-material';

interface Props {
    class?: IClass;
    periods: IPeriod[];
    classSubjects: IClassSubject[];
    teachers: ITeacher[];
    subjects: ISubject[];
    selectedClassSubject: string;
    onSelectClassSubject: (selectedSub: string) => void;
    onReshuffle: () => void
}
const TimetableGrid = (props: Props) => {

    const getClassSub = (id: string) => {
        const classSub = props.classSubjects?.find(clzSub => clzSub._id == id);

        return classSub ?? null
    }
    const getSubjectCode = (id: string) => {

        const classSub = getClassSub(id);
        if (!classSub) return '-';
        const subject = props.subjects?.find(sub => sub._id == classSub.subject);
        return subject?.code ?? ''
    }

    const getTeacherCode = (id: string) => {

        const classSub = getClassSub(id);
        if (!classSub) return '-';
        const teacher = props.teachers?.find(teacher => teacher._id == classSub.teacher);
        return teacher?.code ?? ''
    }

    return (

        <Box sx={{ p: 1 }}>
            <TableContainer component={Paper}
                sx={{
                    transition: 'width 0.3s ease',
                    boxShadow: 1,
                    borderRadius: 1
                }}>
                <Table size="small" aria-label="compact timetable">
                    <TableHead>
                        {props.class && <TableRow>
                            {/* The first row of the table head will contain the title */}
                            <TableCell colSpan={periodsList.length + 1} align="center" >
                                <Tooltip title="Shuffle">

                                    <IconButton aria-label="" onClick={() => props.onReshuffle()} sx={{ float: 'right' }}>
                                        <RepeatIcon />
                                    </IconButton></Tooltip>
                                <Typography variant="h6" color="initial" sx={{ fontWeight: 'bold' }}>
                                    {`${classList[props.class.name]} ${props.class.div}`}
                                </Typography>
                            </TableCell>
                        </TableRow>}
                        <TableRow>
                            {/* The second row of the table head will contain the period headers */}
                            <TableCell sx={{ minWidth: 60, p: 1 }}></TableCell>
                            {periodsList.map(period => (
                                <TableCell key={period} align="center" sx={{ fontWeight: 'bold', p: 1, whiteSpace: 'nowrap' }}>
                                    {period}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {daysList.map((day) => (
                            <TableRow
                                key={day}
                                sx={{ '&:nth-of-type(odd)': { bgcolor: '#FAFAFA' } }}
                            >
                                <TableCell
                                    component="th"
                                    scope="row"
                                    sx={{
                                        fontWeight: 'medium',
                                        p: 1,
                                        width: '90px',
                                        whiteSpace: 'nowrap',
                                        textAlign: 'center'
                                    }}
                                >
                                    {day}
                                </TableCell>
                                {periodsList.map(period => {
                                    const _period: IPeriod | null = props.periods?.find(per => per.day === day && per.period === period) ?? null
                                    return (
                                        <TableCell
                                            key={`${day}-${period}`}
                                            align="center"
                                            sx={{
                                                cursor: _period?.classSubject ? 'pointer' : 'default',
                                                p: 0.5,
                                            }}
                                        >
                                            {
                                                _period?.classSubject ?
                                                    <PeriodCard
                                                        subject={getSubjectCode(_period.classSubject)}
                                                        teacher={getTeacherCode(_period.classSubject)}
                                                        onClick={() => props.onSelectClassSubject(_period.classSubject)}
                                                        selected={_period.classSubject === props.selectedClassSubject}
                                                    /> :
                                                    <Box sx={{ color: 'text.disabled' }}>-</Box>
                                            }
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default TimetableGrid
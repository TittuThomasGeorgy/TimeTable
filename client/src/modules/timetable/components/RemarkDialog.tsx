
import type { IRemark } from '../types/Remarks';
import type { ISubject } from '../../subject/types/Subject';
import type { ITeacher } from '../../teacher/types/Teacher';
import { Box, Stack, Typography } from '@mui/material';
import TeacherChip from '../../teacher/components/TeacherChip';

interface Props {
    subject: ISubject;
    teacher: ITeacher;
    noOfHours: number;
    totalNoOfHours: number;
    remarks: IRemark[];
}
const RemarkDialog = (props: Props) => {
    return (
        <Box
            sx={{
                position: 'sticky',
                top: '20px', // Adjust this value to control how far down it sticks
                right: '20px', // Adjust this value to control how far from the right it is
                zIndex: 100, // Optional: ensures it stays on top of other content
                float: 'right', // Added float for initial positioning, although 'sticky' overrides it
            }}
        >
            <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h5" component="h6" sx={{ fontWeight: 'bold', mb: 0.5, color: 'text.primary', textAlign: 'center' }}>
                    {` ${props.subject.name} ( ${props.subject.code} )`}
                </Typography>
                {<TeacherChip value={props.teacher} disableTeacherNavigate={true} />}
                <Typography variant="body2" color="text.secondary">
                    {props.noOfHours} / {props.totalNoOfHours}
                </Typography>
            </Stack>
            <ul>
                {props.remarks.map((remark, indx) =>
                    <li key={indx}>
                        <Typography variant="body1" color="initial">{remark.remark}</Typography>
                    </li>
                )}

            </ul>
        </Box>
    )
}

export default RemarkDialog
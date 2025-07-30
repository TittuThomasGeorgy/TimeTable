import { Card, CardContent, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { IClassSubject } from '../types/ClassSubject';
import type { ISubject } from '../../subject/types/Subject';
import TeacherChip from '../../teacher/components/TeacherChip';
import type { ITeacher } from '../../teacher/types/Teacher';

const ClassSubCard = (props: { value: IClassSubject }) => {
    const navigate = useNavigate();
    const { subject, teacher } = props.value;

    return (
        <Card
            onClick={() => navigate(`/subject/${(subject as ISubject)._id}`)}
            sx={{
               cursor: 'pointer',
                borderRadius: 2,
                boxShadow: 3,
                transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
                '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-5px)',
                },
            }}
        >
            <CardContent sx={{ p: '16px !important' }}> {/* Override default padding */}
                <Stack direction="column" spacing={1} alignItems="center">
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 0.5, color: 'text.primary' }}>
                        {(subject as ISubject).name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Teacher: <TeacherChip value={teacher as ITeacher} />
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default ClassSubCard;
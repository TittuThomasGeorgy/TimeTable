import { Card, CardContent, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { IClassSubject } from '../types/ClassSubject';
import type { ISubject } from '../../subject/types/Subject';
import TeacherChip from '../../teacher/components/TeacherChip';
import type { ITeacher } from '../../teacher/types/Teacher';
import MenuButton from '../../../components/MenuButton';
import { Edit as EditIcon, Visibility } from '@mui/icons-material';

interface Props {
    value: IClassSubject;
    onEdit: () => void;
}
const ClassSubCard = (props: Props) => {
    const navigate = useNavigate();
    const { subject, teacher, noOfHours } = props.value;

    return (
        <Card
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
                    <Typography variant="h5" component="h6" sx={{ fontWeight: 'bold', mb: 0.5, color: 'text.primary',textAlign:'center' }}>
                        {(subject as ISubject).code}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <TeacherChip value={teacher as ITeacher} />
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        0 / {noOfHours}
                    </Typography>
                </Stack>
                <MenuButton menuItems={[
                    { label: 'Edit', onClick: props.onEdit, icon: <EditIcon color='primary' sx={{mt:.5}} /> },
                    { label: 'View', onClick: () => navigate(`/subject/${(subject as ISubject)._id}`), icon: <Visibility color='primary' sx={{mt:.5}}/> },
                ]} sx={{ float: 'right' }} />
            </CardContent>
        </Card>
    );
};

export default ClassSubCard;
import { Card, CardContent, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { IClassSubject } from '../types/ClassSubject';
import type { ISubject } from '../../subject/types/Subject';
import TeacherChip from '../../teacher/components/TeacherChip';
import type { ITeacher } from '../../teacher/types/Teacher';
import MenuButton from '../../../components/MenuButton';
import {  Edit as EditIcon,  Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import type { IClass } from '../types/Class';
import classList from '../constants/ClassList.default';

interface Props {
    value: IClassSubject;
    onEdit?: () => void;
    onDelete?: () => void;
    type: 'class' | 'teacher' | 'subject';
    options?:boolean;
    onClick?: () => void;
    isSelected?:boolean;
    disableTeacherNavigate?:boolean;
}
const ClassSubCard = (props: Props) => {
    const navigate = useNavigate();
    const { class: _class, subject, teacher, noOfHours } = props.value;

    return (
        <Card
        onClick={props.onClick}
            sx={{
                cursor: props.onClick?'pointer':'default',
                bgcolor:props.isSelected?'greenyellow':'initial',
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
                    <Typography variant="h5" component="h6" sx={{ fontWeight: 'bold', mb: 0.5, color: 'text.primary', textAlign: 'center' }}>
                        {props.type == 'class' ? (subject as ISubject).code : `${classList[(_class as IClass)?.name ?? -1]} ${(_class as IClass)?.div}`}
                    </Typography>
                    {props.type == 'teacher' ? <Typography variant="body2" color="text.secondary">
                        {(subject as ISubject).code}
                    </Typography> : <TeacherChip value={teacher as ITeacher} disableTeacherNavigate={props.disableTeacherNavigate}/>}
                    <Typography variant="body2" color="text.secondary">
                        0 / {noOfHours}
                    </Typography>
                </Stack>
                {props.options&&<MenuButton
                    menuItems={[
                        ...(props.onEdit ? [{ label: 'Edit', onClick: props.onEdit, icon: <EditIcon color='primary' sx={{ mt: .5 }} /> }] : []),
                        { label: 'View', onClick: () => navigate(props.type === 'class' ? `/subject/${(subject as ISubject)._id}` : `/class/${(_class as IClass)._id}`), icon: <VisibilityIcon color='primary' sx={{ mt: .5 }} /> },
                        ...(props.onDelete ? [{ label: 'Delete', onClick: props.onDelete, icon: <DeleteIcon color='error' sx={{ mt: .5 }} /> }] : []),
                    ]} sx={{ float: 'right' }} />}
            </CardContent>


        </Card>
    );
};

export default ClassSubCard;
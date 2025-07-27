import Avatar from '@mui/material/Avatar'
import { Card, CardContent, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { ITeacher } from '../types/Teacher'

const TeacherCard = (props: { value: ITeacher }) => {
    const navigate = useNavigate();
    return (
        <Card onClick={() =>
            navigate(`/teacher/${props.value._id}`)}>
            <CardContent>
                <Stack direction="row"
                    spacing={2}>
                    <Avatar aria-label="" src={props.value.image} />
                    <Stack direction="column"
                        spacing={0}>
                        <Typography variant="body1" color="initial">
                            {props.value.name}
                        </Typography>
                        <Typography variant="caption" color="initial">{props.value.subject}</Typography>
                    </Stack>
                </Stack>
            </CardContent>

        </Card>
    )
}

export default TeacherCard
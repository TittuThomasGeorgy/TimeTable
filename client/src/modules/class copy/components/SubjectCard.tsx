import { Card, CardContent, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { ISubject } from '../types/Subject';

const SubjectCard = (props: { value: ISubject }) => {
    const navigate = useNavigate();
    return (
        <Card onClick={() =>
            navigate(`/subject/${props.value._id}`)}>
            <CardContent>
               
                    <Stack direction="column"
                        spacing={0}>
                        <Typography variant="body1" color="initial">
                            {props.value.name}
                        </Typography>
                        <Typography variant="body2" color="initial">
                            {props.value.code}
                        </Typography>
                    </Stack>
            </CardContent>

        </Card>
    )
}

export default SubjectCard
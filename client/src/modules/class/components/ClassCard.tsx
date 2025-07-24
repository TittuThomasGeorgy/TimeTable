import { Card, CardContent, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { IClass } from '../types/Class';

const ClassCard = (props: { value: IClass }) => {
    const navigate = useNavigate();
    return (
        <Card onClick={() =>
            navigate(`/class/${props.value._id}`)}>
            <CardContent>
               
                    <Stack direction="column"
                        spacing={0}>
                        <Typography variant="body1" color="initial">
                            {props.value.name}
                        </Typography>
                    </Stack>
            </CardContent>

        </Card>
    )
}

export default ClassCard
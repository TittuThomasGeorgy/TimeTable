import { Card, CardContent, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { IClass } from '../types/Class';
import classList from '../constants/ClassList.default';

const ClassCard = (props: { value: IClass }) => {
    const navigate = useNavigate();
    return (
        <Card onClick={() =>
            navigate(`/class/${props.value._id}`)}
            sx={{
                cursor: 'pointer',
                borderRadius: 2,
                boxShadow: 3,
                transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
                '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-5px)',
                },
            }}>
            <CardContent>

                <Stack direction="column"
                    spacing={0}>
                    <Typography variant="body1" color="initial">
                        {classList[props.value.name]} {props.value.div}
                    </Typography>
                </Stack>
            </CardContent>

        </Card>
    )
}

export default ClassCard
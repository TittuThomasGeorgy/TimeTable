import { Box, Typography } from '@mui/material';

interface Props {
    teacher: string;
    subject: string;
    // class:string;
    onClick: () => void;
    selected: boolean;

}
const PeriodCard = (props: Props) => {

    return (
        <Box
            onClick={props.onClick}
            sx={{
                bgcolor: props.selected ? '#A0E2D8' : 'initial',
                borderRadius: 2,
                // boxShadow: 3,
                transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
                '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-5px)',
                },
            }}
        >

            <Typography variant="body1" color="initial">{props.subject}</Typography>
            <Typography variant="caption" color="initial">{props.teacher}</Typography>
        </Box>
    );
};
export default PeriodCard
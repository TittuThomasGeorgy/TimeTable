import {  Paper, Typography } from '@mui/material';

interface Props {
    teacher: string;
    subject: string;
    // class:string;
    onClick: () => void;
    selected: boolean;

}
const PeriodCard = (props: Props) => {
    return (
        <Paper
            onClick={props.onClick}
            elevation={props.selected ? 3 : 0} // Reduced elevation
            sx={{
                p: 0.5, // Significantly reduced padding
                borderRadius: 1, // Smaller border radius
                transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
                bgcolor: props.selected ? '#A0E2D8' : 'background.paper',
                border: props.selected ? '1px solid #7EC6B8' : '1px solid #E0E0E0',
                '&:hover': {
                    bgcolor: props.selected ? '#A0E2D8' : '#F5F5F5',
                    boxShadow: props.selected ? 6 : 1,
                    transform: 'scale(1.02)', // Use scale for a subtle hover effect
                },
            }}
        >
            <Typography variant="body2" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}> 
                
                {props.subject}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}> 
                {props.teacher}
            </Typography>
        </Paper>
    );
};
export default PeriodCard
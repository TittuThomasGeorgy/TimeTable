import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material';

interface ConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
}

const ConfirmationDialog = (props: ConfirmationDialogProps) => {
    return (
        <Dialog open={props.open} onClose={() => props.onClose()}>
            <DialogTitle>
                {props.title}
            </DialogTitle>
            <DialogActions>
                <Button onClick={() => props.onClose()} variant='outlined'>
                    Cancel
                </Button>
                <Button onClick={(e) => { e.preventDefault(); props.onConfirm();props.onClose(); }} variant='contained' color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmationDialog
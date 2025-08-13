import { Dialog, DialogTitle, DialogContent, Container, Grid, TextField, DialogActions, Button } from '@mui/material';
// import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react'
import { capitalize } from '../../../functions/capitalize';
import { defTimetable } from '../constants/Timetable.default';
import type { ITimetable } from '../types/Timetable';
import { useCreateTimetable, useUpdateTimetable } from '../hooks/useTimetable';

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (value: ITimetable) => void;
    value?: ITimetable
}

const AddTimetableDialog = (props: Props) => {
    const isEdit = !!props.value;
    const [form, setForm] = useState<ITimetable>(defTimetable);
    const { mutate, isPending: isCreating } = useCreateTimetable();
    const { mutate: update, isPending: updating } = useUpdateTimetable();

    const handleClose = () => {
        setForm(defTimetable);
        props.onClose();
    }
    const handleSubmit = () => {

        const _form = { ...form, name: capitalize(form.name) }

        if (isEdit)
            update(_form, { onSuccess: () => { handleClose(); props.onSubmit(_form); } });
        else
            mutate(_form, { onSuccess: () => { handleClose(); props.onSubmit(_form); } });
    };

    useEffect(() => {
        if (props.value)
            setForm(props.value)
        else
            setForm(defTimetable)
    }, [props.value])

    return (
        <Dialog open={props.open} onClose={handleClose}>
            <form onSubmit={(e) => {
                e.preventDefault();

                handleSubmit();
            }}>
                <DialogTitle>{(isEdit ? 'Edit ' : 'Add ') + 'Timetable'}</DialogTitle>
                <DialogContent>
                    <Container>
                        <Grid container spacing={1} sx={{ mt: .5 }}>

                            <Grid size={{ xs: 12 }}>
                                {/* &ensp; */}
                                <TextField
                                    label="Name"
                                    value={form.name}
                                    onChange={(e) => {
                                        setForm(_sub => ({ ..._sub, name: e.target.value }))
                                    }}
                                    fullWidth
                                    required
                                />
                            </Grid>
                        </Grid>
                    </Container>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { handleClose() }} disabled={isCreating || updating}>Cancel</Button>
                    <Button type="submit" disabled={isCreating || updating}> {isEdit ? 'Edit' : 'Add'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default AddTimetableDialog
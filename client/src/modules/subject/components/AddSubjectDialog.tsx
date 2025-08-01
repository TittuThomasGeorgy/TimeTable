import { Dialog, DialogTitle, DialogContent, Container, Grid, TextField, DialogActions, Button, Autocomplete, Box, Avatar, Typography } from '@mui/material';
// import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react'
import type { ISubject } from '../types/Subject';
import { useGetTeachers } from '../../teacher/hooks/useTeacher';
import { useCreateSubject, useUpdateSubject } from '../hooks/useSubject';
import { defSubject } from '../constants/Subject.default';
import { capitalize } from '../../../services/capitalize';

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (value: ISubject) => void;
    value?: ISubject
}

const AddSubjectDialog = (props: Props) => {
    const isEdit = !!props.value;
    const [form, setForm] = useState<ISubject>(defSubject);
    const { data: res, isLoading } = useGetTeachers();
    const teachers = res?.data;
    const { mutate, isPending: isCreating } = useCreateSubject();
    const { mutate: update, isPending: updating } = useUpdateSubject();

    const handleClose = () => {
        setForm(defSubject);
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
            setForm(defSubject)
    }, [props.value])

    return (
        <Dialog open={props.open} onClose={handleClose}>
            <form onSubmit={(e) => {
                e.preventDefault();

                handleSubmit();
            }}>
                <DialogTitle>{(isEdit ? 'Edit ' : 'Add ') + 'Subject'}</DialogTitle>
                <DialogContent>
                    <Container>
                        <Grid container spacing={1}>

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
                            <Grid size={{ xs: 12 }}>
                                {/* &ensp; */}
                                <TextField
                                    label="Code"
                                    value={form.code}
                                    onChange={(e) => {
                                        setForm(_sub => ({ ..._sub, code: e.target.value }))
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

export default AddSubjectDialog
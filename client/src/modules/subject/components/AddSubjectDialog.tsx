import { Dialog, DialogTitle, DialogContent, Container, Grid, TextField, DialogActions, Button, Autocomplete, Box, Avatar, Typography } from '@mui/material';
// import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react'
import type { ISubject } from '../types/Subject';
import { useGetTeachers } from '../../teacher/hooks/useTeacher';
import { useCreateSubject, useUpdateSubject } from '../hooks/useSubject';
import { defSubject } from '../constants/Subject.default';
import type { ITeacher } from '../../teacher/types/Teacher';

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

    const handleSubmit = () => {

        if (isEdit)
            update(form, { onSuccess: () => { props.onClose(); props.onSubmit(form);setForm(defSubject)} });
        else
            mutate(form, { onSuccess: () => { props.onClose(); props.onSubmit(form); setForm(defSubject)} });
    };

    useEffect(() => {
        if (props.value)
            setForm(props.value)
        else
            setForm(defSubject)
    }, [props.value])

    return (
        <Dialog open={props.open} onClose={() => props.onClose()}>
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
                    <Button onClick={() => props.onClose()} disabled={isCreating || updating}>Cancel</Button>
                    <Button type="submit" disabled={isCreating || updating}> {isEdit ? 'Edit' : 'Add'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default AddSubjectDialog
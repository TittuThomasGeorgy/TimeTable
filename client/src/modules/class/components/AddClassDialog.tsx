import { Dialog, DialogTitle, DialogContent, Container, Grid, TextField, DialogActions, Button } from '@mui/material';
// import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react'
import type { IClass } from '../types/Class';
import { defClass } from '../constants/Class.default';
import { useCreateTeacher, useUpdateTeacher } from '../hooks/useTeacher';

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (value: IClass) => void;
    value?: IClass
}

const AddClassDialog = (props: Props) => {
    const isEdit = !!props.value;
    const [form, setForm] = useState<IClass>(defClass);
    const { mutate, isPending: isCreating } = useCreateTeacher();
    const { mutate: update, isPending: updating } = useUpdateTeacher();
    // const [file1, setFile1] = useState<File>();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = () => {

        // if (isEdit)
        //     update(form, { onSuccess: () => { props.onClose(); props.onSubmit(form); } });
        // else
        //     mutate(form, { onSuccess: () => { props.onClose(); props.onSubmit(form); } });
    };

    useEffect(() => {
        if (props.value)
            setForm(props.value)
        else
            setForm(defClass)
    }, [props.value])

    return (
        <Dialog open={props.open} onClose={() => props.onClose()}>
            <form onSubmit={(e) => {
                e.preventDefault();

                handleSubmit();
            }}>
                <DialogTitle>{(isEdit ? 'Edit ' : 'Add ') + 'Teacher'}</DialogTitle>
                <DialogContent>
                    <Container>
                        <Grid container spacing={1}>

                            <Grid size={{ xs: 12 }}>
                                {/* &ensp; */}
                                <TextField
                                    label="Name"
                                    value={form.name}
                                    onChange={(e) => {
                                        setForm(Teacher => ({ ...Teacher, name: e.target.value }))
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

export default AddClassDialog
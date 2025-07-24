import { Dialog, DialogTitle, DialogContent, Container, Grid, TextField, DialogActions, Button, Autocomplete, Box, Avatar, Typography } from '@mui/material';
// import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react'
import type { IClass } from '../types/Class';
import { defClass } from '../constants/Class.default';
import { useGetTeachers } from '../../teacher/hooks/useTeacher';
import { useCreateClass, useUpdateClass } from '../hooks/useClass';

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (value: IClass) => void;
    value?: IClass
}

const AddClassDialog = (props: Props) => {
    const isEdit = !!props.value;
    const [form, setForm] = useState<IClass>(defClass);
    const { data: res, isLoading } = useGetTeachers();
    const teachers = res?.data;
    const { mutate, isPending: isCreating } = useCreateClass();
    const { mutate: update, isPending: updating } = useUpdateClass();

    const handleSubmit = () => {

        if (isEdit)
            update(form, { onSuccess: () => { props.onClose(); props.onSubmit(form); } });
        else
            mutate(form, { onSuccess: () => { props.onClose(); props.onSubmit(form); } });
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
                <DialogTitle>{(isEdit ? 'Edit ' : 'Add ') + 'Class'}</DialogTitle>
                <DialogContent>
                    <Container>
                        <Grid container spacing={1}>

                            <Grid size={{ xs: 12 }}>
                                {/* &ensp; */}
                                <TextField
                                    label="Name"
                                    value={form.name}
                                    onChange={(e) => {
                                        setForm(_class => ({ ..._class, name: e.target.value }))
                                    }}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Autocomplete
                                    options={teachers ?? []}
                                    autoHighlight
                                    fullWidth
                                    getOptionLabel={(option) => option.name}
                                    renderOption={(props, option) => {
                                        const { key, ...optionProps } = props;
                                        return (
                                            isLoading ? <Typography variant="body1" color="initial">Loading...</Typography> :
                                                <Box
                                                    key={key}
                                                    component="li"
                                                    sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                                                    {...optionProps}
                                                >
                                                    <Avatar aria-label="" src={option.image} />&nbsp;
                                                    {option.name}
                                                </Box>
                                        );
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select a teacher"

                                        />
                                    )}
                                    value={teachers?.find(teacher => teacher._id === form.classTeacher)}
                                    onChange={(_, newValue) => {
                                        if (newValue)
                                            setForm(_class => ({ ..._class, classTeacher: newValue?._id }))

                                    }}
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
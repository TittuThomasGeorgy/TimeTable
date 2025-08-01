import { Dialog, DialogTitle, DialogContent, Container, Grid, TextField, DialogActions, Button, Autocomplete, Box, Avatar, Typography } from '@mui/material';
// import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react'
import type { IClass } from '../types/Class';
import { defClass } from '../constants/Class.default';
import { useGetTeachers } from '../../teacher/hooks/useTeacher';
import { useCreateClass, useUpdateClass } from '../hooks/useClass';
import classList from '../constants/ClassList.default';

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

    const handleClose = () => {
        setForm(defClass);
        props.onClose();
    }
    const handleSubmit = () => {

        if (isEdit)
            update(form, { onSuccess: () => { handleClose(); props.onSubmit(form); } });
        else
            mutate(form, { onSuccess: () => { handleClose(); props.onSubmit(form); } });
    };

    useEffect(() => {
        if (props.value)
            setForm(props.value)
        else
            setForm(defClass)
    }, [props.value])

    return (
        <Dialog open={props.open} onClose={handleClose}>
            <form onSubmit={(e) => {
                e.preventDefault();

                handleSubmit();
            }}>
                <DialogTitle>{(isEdit ? 'Edit ' : 'Add ') + 'Class'}</DialogTitle>
                <DialogContent>
                    <Container>
                        <Grid container spacing={1}>

                            <Grid size={6}>
                                {/* &ensp; */}
                                <Autocomplete
                                    options={classList ?? []}
                                    value={classList[form.name]}
                                    onChange={(_, newVal) => {
                                        if (newVal)
                                            setForm(_class => ({ ..._class, name: classList.indexOf(newVal) }))
                                        else
                                            setForm(_class => ({ ..._class, name: -1 }))
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label=" Class"
                                            required
                                        />
                                    )}
                                    sx={{mt:.5}}
                                    
                                />
                            </Grid>
                            <Grid size={6}>
                                {/* &ensp; */}
                                <Autocomplete
                                    options={["A","B","C","D","SCI","COM"]}
                                    value={form.div}
                                    onChange={(_, newVal) => {
                                        if (newVal)
                                            setForm(_class => ({ ..._class, div: newVal }))
                                        else
                                            setForm(_class => ({ ..._class, div: "" }))
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Division"
                                            required
                                        />
                                    )}
                                    sx={{mt:.5}}
                                    
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
                                        else
                                            setForm(_class => ({ ..._class, classTeacher: '' }))

                                    }}
                                />
                            </Grid>

                        </Grid>
                    </Container>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose()} disabled={isCreating || updating}>Cancel</Button>
                    <Button type="submit" disabled={isCreating || updating}> {isEdit ? 'Edit' : 'Add'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default AddClassDialog
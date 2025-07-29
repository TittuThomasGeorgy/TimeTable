import { Dialog, DialogTitle, DialogContent, Container, Grid, TextField, DialogActions, Button, Autocomplete, Box, Avatar, Typography } from '@mui/material';
// import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react'
import type { IClass } from '../types/Class';
import { defClass } from '../constants/Class.default';
import { useGetTeachers } from '../../teacher/hooks/useTeacher';
import { useCreateClass, useUpdateClass } from '../hooks/useClass';
import type { IClassSubject } from '../types/ClassSubject';
import { defClassSubject } from '../constants/ClassSubject.default';
import { useGetSubjects } from '../../subject/hooks/useSubject';
import { useCreateClassSubject, useUpdateClassSubject } from '../hooks/useClassSubject';

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (value: IClassSubject) => void;
    value?: IClassSubject|null;
    classId:string;
}

const AddClassSubjectDialog = (props: Props) => {
    const isEdit = !!props.value;
    const [form, setForm] = useState<IClassSubject>({...defClassSubject,class:props.classId});
    const { data: teacherRes, isLoading:isTeachersLoading } = useGetTeachers();
    const teachers = teacherRes?.data;
    const { data: subRes, isLoading:isSubjectssLoading } = useGetSubjects();
    const subjects = subRes?.data;
    const { mutate, isPending: isCreating } = useCreateClassSubject();
    const { mutate: update, isPending: updating } = useUpdateClassSubject();

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
            setForm({...defClassSubject,class:props.classId})
    }, [props.classId, props.value])

    return (
        <Dialog open={props.open} onClose={() => props.onClose()}>
            <form onSubmit={(e) => {
                e.preventDefault();

                handleSubmit();
            }}>
                <DialogTitle>{(isEdit ? 'Edit ' : 'Add ') + 'Class Subject'}</DialogTitle>
                <DialogContent>
                    <Container>
                        <Grid container spacing={1}>

                           
                            <Grid size={{ xs: 12 }}>
                                <Autocomplete
                                    options={subjects ?? []}
                                    autoHighlight
                                    fullWidth
                                    getOptionLabel={(option) => option.name}
                                  
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select a Subject"

                                        />
                                    )}
                                    value={subjects?.find(subject => subject._id === form.subject)}
                                    onChange={(_, newValue) => {
                                        if (newValue)
                                            setForm(_class => ({ ..._class, subject: newValue?._id }))

                                    }}
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
                                            isTeachersLoading ? <Typography variant="body1" color="initial">Loading...</Typography> :
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
                                    value={teachers?.find(teacher => teacher._id === form.teacher)}
                                    onChange={(_, newValue) => {
                                        if (newValue)
                                            setForm(_class => ({ ..._class, teacher: newValue?._id }))

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

export default AddClassSubjectDialog
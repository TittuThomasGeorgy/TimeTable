import { Dialog, DialogTitle, DialogContent, Container, Grid, TextField, DialogActions, Button, Autocomplete, Box, Avatar, Typography } from '@mui/material';
// import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react'
import { useGetTeachers } from '../../teacher/hooks/useTeacher';
import type { IClassSubject } from '../types/ClassSubject';
import { defClassSubject } from '../constants/ClassSubject.default';
import { useGetSubjects } from '../../subject/hooks/useSubject';
import { useCreateClassSubject, useUpdateClassSubject } from '../hooks/useClassSubject';
import { Add } from '@mui/icons-material';
import CustomIconButton from '../../../components/CustomIconButton';

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (value: IClassSubject) => void;
    onAddTeacher: () => void;
    onAddSubject: () => void;
    value?: IClassSubject | null;
    classId: string;
}

const AddClassSubjectDialog = (props: Props) => {
    const isEdit = !!props.value;
    const [form, setForm] = useState<IClassSubject>({ ...defClassSubject, class: props.classId });
    const { data: teacherRes, isLoading: isTeachersLoading } = useGetTeachers();
    const teachers = teacherRes?.data;
    const { data: subRes, isLoading: isSubjectsLoading } = useGetSubjects();
    const subjects = subRes?.data;
    const { mutate, isPending: isCreating } = useCreateClassSubject();
    const { mutate: update, isPending: updating } = useUpdateClassSubject();

    const handleClose = () => {
        setForm({ ...defClassSubject, class: props.classId });
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
            setForm({ ...defClassSubject, class: props.classId })
    }, [props.classId, props.value])

    return (
        <Dialog open={props.open} onClose={handleClose}>
            <form onSubmit={(e) => {
                e.preventDefault();

                handleSubmit();
            }}>
                <DialogTitle>{(isEdit ? 'Edit ' : 'Add ') + 'Class Subject'}</DialogTitle>
                <DialogContent>
                    <Container>
                        <Grid container spacing={1}>


                            <Grid size={{ xs: 12 }} sx={{ display: "flex", flexDirection: 'row' }}>
                                <Autocomplete
                                    options={subjects ?? []}
                                    autoHighlight
                                    fullWidth
                                    getOptionLabel={(option) => option.name}
                                    renderOption={(props, option) => {
                                        const { key, ...optionProps } = props;
                                        return (
                                            isSubjectsLoading ? <Typography variant="body1" color="initial">Loading...</Typography> :
                                                <Box
                                                    key={key}
                                                    component="li"

                                                    {...optionProps}
                                                >
                                                    {option.name}
                                                </Box>
                                        );
                                    }}
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
                                        else
                                            setForm(_class => ({ ..._class, subject: '' }))

                                    }}
                                    sx={{ mt: .5 }}

                                />
                                <CustomIconButton icon={<Add />} onClick={props.onAddSubject} title='Add Subject' />
                            </Grid>
                            <Grid size={{ xs: 12 }} sx={{ display: "flex", flexDirection: 'row' }}>
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
else
                                            setForm(_class => ({ ..._class, teacher: '' }))

                                    }}
                                />
                                <CustomIconButton icon={<Add />} onClick={props.onAddTeacher} title='Add Teacher' />

                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Number of hours"
                                    type='tel'
                                    value={form.noOfHours}
                                    onChange={(e) => {
                                        setForm(Teacher => ({ ...Teacher, noOfHours: Number(e.target.value) }))
                                    }}
                                    fullWidth
                                    required

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

export default AddClassSubjectDialog
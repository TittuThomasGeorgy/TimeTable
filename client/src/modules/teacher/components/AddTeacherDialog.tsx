import { Dialog, DialogTitle, DialogContent, Container, Grid, TextField, DialogActions, Button, IconButton, InputAdornment, Autocomplete, Typography, Avatar, Box } from '@mui/material';
// import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react'
import { Add, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import type { ITeacher } from '../types/Teacher';
import { defTeacher } from '../constants/Teacher.default';
import ImageUploader from '../../../components/ImageUploader';
import { useCreateTeacher, useUpdateTeacher } from '../hooks/useTeacher';
import { useGetSubjects } from '../../subject/hooks/useSubject';
import CustomIconButton from '../../../components/CustomIconButton';
import { capitalize } from '../../../functions/capitalize';

interface Props {
    open: boolean;
    onClose: () => void;
    onAddSubject: () => void;
    onSubmit: (value: ITeacher) => void;
    value?: ITeacher
}

const AddTeacherDialog = (props: Props) => {
    const isEdit = !!props.value;
    const [form, setForm] = useState<ITeacher>(defTeacher);
    const { mutate, isPending: isCreating } = useCreateTeacher();
    const { mutate: update, isPending: updating } = useUpdateTeacher();
    // const [file1, setFile1] = useState<File>();
    const { data: res, isLoading } = useGetSubjects();
    const subjects = res?.data;
    const [showPassword, setShowPassword] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleClose = () => {
        setForm(defTeacher);
        props.onClose();
    }
    const handleSubmit = () => {
        const userError = validateUsername(form.username);
        const passError = validatePassword(form.password);
        if (userError) {
            setUsernameError(userError);
            return;
        }
        else {
            setUsernameError('')
        }
        if (passError) {
            setPasswordError(passError);
            return;
        }
        else {
            setPasswordError('')
        }
        const _form = { ...form, name: capitalize(form.name) }

        if (isEdit)
            update(_form, { onSuccess: () => { handleClose(); props.onSubmit(_form); } });
        else
            mutate(_form, { onSuccess: () => { handleClose(); props.onSubmit(_form); } });
    };
    const validateUsername = (username: string) => {
        // Example: Username should be at least 4 characters long
        if (username.length < 4) {
            return "Username must be at least 4 characters long";
        }
        return '';
    };

    const validatePassword = (password: string) => {
        if (isEdit && !password)
            return '';
        // Example: Password should have at least 8 characters, including letters and numbers
        if (password.length < 8) {
            return "Password must be at least 8 characters long";
        }
        if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
            return "Password must contain both letters and numbers";
        }
        return '';
    };

    useEffect(() => {
        if (props.value)
            setForm(props.value)
        else
            setForm(defTeacher)
    }, [props.value])

    return (
        <Dialog open={props.open} onClose={() => handleClose()}>
            <form onSubmit={(e) => {
                e.preventDefault();

                handleSubmit();
            }}>
                <DialogTitle>{(isEdit ? 'Edit ' : 'Add ') + 'Teacher'}</DialogTitle>
                <DialogContent>
                    <Container>
                        <Grid container spacing={1}>
                            <Grid size={{ xs: 12 }}>
                                <ImageUploader value={form.image} onChange={(newVal) => {
                                    setForm(Teacher => ({ ...Teacher, image: newVal }))
                                }}
                                    destination='teachers'
                                />
                            </Grid>
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
                            <Grid size={{ xs: 12 }}>
                                {/* &ensp; */}
                                <TextField
                                    label="Code"
                                    value={form.code}
                                    onChange={(e) => {
                                        setForm(Teacher => ({ ...Teacher, code: e.target.value }))
                                    }}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                {/* &ensp; */}
                                <TextField
                                    label="Experience"
                                    type='tel'
                                    value={form.exp}
                                    onChange={(e) => {
                                        setForm(Teacher => ({ ...Teacher, exp: Number(e.target.value) }))
                                    }}
                                    fullWidth
                                    required

                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                {/* &ensp; */}
                                <TextField
                                    label="Username"
                                    value={form.username}
                                    onChange={(e) => {
                                        setForm(Teacher => ({ ...Teacher, username: e.target.value }))
                                    }}
                                    fullWidth
                                    required
                                    error={!!usernameError}
                                    helperText={usernameError}
                                    disabled={isEdit}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                {/* &ensp; */}
                                <TextField
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={(e) => {
                                        setForm(Teacher => ({ ...Teacher, password: e.target.value }));
                                    }}
                                    fullWidth
                                    required={!isEdit}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    error={!!passwordError}
                                    helperText={passwordError}

                                />
                            </Grid>
                            <Grid size={{ xs: 12 }} sx={{ display: "flex", flexDirection: 'row' }}>
                                <Autocomplete
                                    options={subjects ?? []}
                                    autoHighlight
                                    fullWidth
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select a Subject"
                                            required
                                        />
                                    )}
                                    value={subjects?.find(sub => sub._id === form.subject)}
                                    onChange={(_, newValue) => {
                                        if (newValue)
                                            setForm(_class => ({ ..._class, subject: newValue?._id }))
else
                                            setForm(_class => ({ ..._class, subject: '' }))

                                    }}
                                />
                                <CustomIconButton icon={<Add />} onClick={props.onAddSubject} title='Add Subject' />
                            </Grid>
                        </Grid>
                    </Container>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={isCreating || updating}>Cancel</Button>
                    <Button type="submit" disabled={isCreating || updating}> {isEdit ? 'Edit' : 'Add'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default AddTeacherDialog
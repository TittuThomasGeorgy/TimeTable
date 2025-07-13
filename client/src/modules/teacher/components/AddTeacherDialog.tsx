import { Dialog, DialogTitle, DialogContent, Container, Grid, TextField, DialogActions, Button, IconButton, InputAdornment } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import ImageUploader from '../../../components/ImageUploader';
import { ICreatableSchool, ISchool } from '../types/SchoolTypes';
import { ICreatableEvent } from '../../events/types/EventTypes';
import useSchool from '../services/SchoolService';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
const defSchool = {
    _id: '',
    name: '',
    address: '',
    code: '',
    logo: '',
    username: '',
    password: '',
    isAdmin: false
}
const AddTeacherDialog = (props: { open: boolean; onClose: () => void; onSubmit: (value: ISchool) => void; action: 'add' | 'edit'; value: ISchool }) => {
    const [creatableSchool, setCreatableSchool] = useState<ISchool>(defSchool);
    const [file1, setFile1] = useState<File>();
    const [showPassword, setShowPassword] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validateUsername = (username: string) => {
        // Example: Username should be at least 4 characters long
        if (username.length < 4) {
            return "Username must be at least 4 characters long";
        }
        return '';
    };

    const validatePassword = (password: string) => {
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
            setCreatableSchool(props.value)
    }, [props.value])

    return (
        <Dialog open={props.open} onClose={() => props.onClose()}>
            <form onSubmit={(e) => {
                e.preventDefault();
                const userError = validateUsername(creatableSchool.username);
                const passError = validatePassword(creatableSchool.password);
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

                if (props.action === 'add' && !file1) {
                    enqueueSnackbar({
                        variant: "error",
                        message: `File missing`
                    });
                    return;
                }
                props.action === 'edit' ?
                    schoolServ.update(creatableSchool, file1).then((res) => {
                        if (res.success) {
                            // setSchools((schools) => schools.map(scl => scl._id === creatableSchool._id ? creatableSchool : scl))
                            props.onSubmit({ ...creatableSchool, score: 0 })
                            enqueueSnackbar({
                                variant: "success",
                                message: res.message
                            })
                        }
                        else
                            enqueueSnackbar({
                                variant: "error",
                                message: `Editing Failed`
                            })
                    }) :
                    schoolServ.create(creatableSchool, file1).then((res) => {
                        if (res.success) {
                            props.onSubmit({ ...creatableSchool, score: 0 })
                            enqueueSnackbar({
                                variant: "success",
                                message: res.message
                            })
                        }
                        else
                            enqueueSnackbar({
                                variant: "error",
                                message: `Adding Failed`
                            })
                    });
                props.onClose();
            }}>
                <DialogTitle>{(props.action === 'edit' ? 'Edit ' : 'Add ') + 'School'}</DialogTitle>
                <DialogContent>
                    <Container>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <ImageUploader value={creatableSchool.logo} onChange={(newVal) => {
                                    setCreatableSchool(school => ({ ...school, logo: newVal }))
                                }}
                                    onFileUpload={(fil) => {
                                        setFile1(fil)
                                    }} />
                            </Grid>
                            <Grid item xs={12}>
                                &ensp;
                                <TextField
                                    label="Name"
                                    value={creatableSchool.name}
                                    onChange={(e) => {
                                        setCreatableSchool(school => ({ ...school, name: e.target.value }))
                                    }}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                &ensp;
                                <TextField
                                    label="Code"
                                    value={creatableSchool.code}
                                    onChange={(e) => {
                                        setCreatableSchool(school => ({ ...school, code: e.target.value }))
                                    }}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                &ensp;
                                <TextField
                                    label="Address"
                                    value={creatableSchool.address}
                                    onChange={(e) => {
                                        setCreatableSchool(school => ({ ...school, address: e.target.value }))
                                    }}
                                    fullWidth
                                    required
                                    multiline
                                    minRows={3}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                &ensp;
                                <TextField
                                    label="Username"
                                    value={creatableSchool.username}
                                    onChange={(e) => {
                                        setCreatableSchool(school => ({ ...school, username: e.target.value }))
                                    }}
                                    fullWidth
                                    required
                                    error={!!usernameError}
                                    helperText={usernameError}
                                    disabled={props.action === 'edit'}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                &ensp;
                                <TextField
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={creatableSchool.password}
                                    onChange={(e) => {
                                        setCreatableSchool(school => ({ ...school, password: e.target.value }));
                                    }}
                                    fullWidth
                                    required={props.action != 'edit'}
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
                        </Grid>
                    </Container>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => props.onClose()}>Cancel</Button>
                    <Button type="submit"> {props.action === 'edit' ? 'Edit' : 'Add'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default AddSchoolDialog
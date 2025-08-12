import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import type { IClassSubject } from '../types/ClassSubject'
import { Autocomplete, Grid, TextField, Typography, FormControlLabel, Checkbox } from '@mui/material'
import { useGetClasses } from '../hooks/useClass'
import classList from '../constants/ClassList.default'
import { useGetClassSubjects, useImportClassSubject } from '../hooks/useClassSubject'
import ClassSubCard from './ClassSubCard'
import type { IImportFrom } from '../types/ImportFrom'

interface Props {
    open: boolean;
    onClose: () => void;
    // onSubmit: (value: IClassSubject) => void;
    classId: string;
}

const ImportClassSubjectDialog = (props: Props) => {
    const { data: res, isLoading } = useGetClasses();
    const classes = res?.data;
    const { mutate:importSubjects, isPending } = useImportClassSubject();
    const defImportForm = {
        from: '',
        to: props.classId,
        subjects: []
    }
    const [importFrom, setImportFrom] = useState<IImportFrom>(defImportForm)

    const { data: resClassSubjects, isLoading: isLoadingClassSubjects } = useGetClassSubjects(importFrom.from || '', 'class');
    const classSubjects = resClassSubjects?.data;
    const classSubjectsId = resClassSubjects?.data?.map(sub => sub._id);
    const [allSelected, setAllSelected] = useState(false)

    const handleClose = () => {
        setImportFrom(defImportForm);
        setAllSelected(false)
        props.onClose();
    }
    const isAllSelected = () => {
        const sortedArr1 = classSubjectsId?.slice().sort() ?? []; // .slice() to avoid mutating the original array
        const sortedArr2 = importFrom.subjects.slice().sort() ?? [];
        const haveSameElements = sortedArr1.length === sortedArr2.length && sortedArr1.every((val, index) => val === sortedArr2[index]);
        setAllSelected(haveSameElements);
    }
    const selectAll = (checked: boolean) => {
        if (checked)
            setImportFrom(prev => ({
                ...prev,
                subjects: classSubjectsId ?? []
            }))
        else
            setImportFrom(prev => ({
                ...prev,
                subjects: []
            }))
        setAllSelected(checked)
    }
const handleSubmit = () => {
        
            importSubjects(importFrom, { onSuccess: () => { handleClose(); } });
          };
    return (
        <Dialog open={props.open} onClose={handleClose} maxWidth={'lg'} fullWidth>
            <DialogTitle>Import Class subjects</DialogTitle>
<form onSubmit={(e) => {
                e.preventDefault();

                handleSubmit();
            }}>
            <DialogContent>

                {/* &ensp; */}
                <Autocomplete
                    options={classes?.filter(cls => cls._id != props.classId) || []}
                    getOptionLabel={(options) => `${classList[options.name]} ${options.div}`}
                    value={classes?.find(cls => cls._id === importFrom.from) || null}
                    onChange={(_, newVal) => {
                        if (newVal)
                            setImportFrom(_class => ({ ..._class, from: newVal._id }))
                        else
                            setImportFrom(_class => ({ ..._class, from: '' }))
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label=" Class"
                            required
                        />
                    )}
                    sx={{ mt: .5, mb: .5 }}
                // fullWidth
                />
                {classSubjects && classSubjects?.length > 0 && <FormControlLabel
                    label="Select All"
                    control={
                        <Checkbox
                            value=""
                            checked={allSelected}
                            onChange={(_, checked) => {
                                selectAll(checked);
                            }}
                            color="primary"
                        />
                    }
                />}
                <Grid container spacing={1}>

                    {
                        isLoadingClassSubjects ? (
                            <Typography>Loading Subjects...</Typography>
                        ) : (
                            classSubjects?.map((sub, index) => (
                                <Grid
                                    size={{ xs: 6, md: 2 }}
                                    key={index}
                                >
                                    <ClassSubCard value={sub}
                                        key={index}
                                        type='class'
                                        onClick={() => {
                                            setImportFrom(prev => {
                                                if (prev.subjects.includes(sub._id))
                                                    return ({ ...prev, subjects: prev.subjects.filter(_sub => _sub != sub._id) })
                                                else
                                                    return ({ ...prev, subjects: [...prev.subjects, sub._id] })
                                            })
                                            isAllSelected();
                                        }}
                                        isSelected={importFrom.subjects.includes(sub._id)}
                                        disableTeacherNavigate
                                    />

                                </Grid>

                            ))

                        )
                    }
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    color="primary"
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending}> Import</Button>

            </DialogActions>
            </form>

        </Dialog>
    )
}

export default ImportClassSubjectDialog
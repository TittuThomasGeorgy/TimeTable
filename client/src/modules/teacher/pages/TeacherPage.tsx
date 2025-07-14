// import React from 'react'
import { Button } from '@mui/material'
import CommonPageLayout from '../../../layouts/CommonPageLayout'
import { Add as AddIcon } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import AddTeacherDialog from '../components/AddTeacherDialog';
import type { ITeacher } from '../types/Teacher';
import { defTeacher } from '../constants/Teacher.default';

const TeacherPage = () => {
    const [open, setOpen] = useState(false);

    return (

        <>
            <CommonPageLayout>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ textTransform: 'none', float: 'right' }}
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                >
                    ADD
                </Button>
                <div>TeacherPage</div>
                <div>TeacherPage</div>
                <div>TeacherPage</div>
                <div>TeacherPage</div>
                <div>TeacherPage</div>
                <div>TeacherPage</div>
                <div>TeacherPage</div>
                <div>TeacherPage</div>
                <div>TeacherPage</div>
                <div>TeacherPage</div>
                <div>TeacherPage</div>
            </CommonPageLayout>
            <AddTeacherDialog open={open} onClose={() => setOpen(false)}
                onSubmit={function (value: ITeacher): void {
                    console.log("Submited");

                }}
            />
        </>
    )
}

export default TeacherPage
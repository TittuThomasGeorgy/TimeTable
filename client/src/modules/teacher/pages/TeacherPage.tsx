// import React from 'react'
import { Button } from '@mui/material'
import CommonPageLayout from '../../../layouts/CommonPageLayout'
import { Add as AddIcon } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';

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
        </>
    )
}

export default TeacherPage
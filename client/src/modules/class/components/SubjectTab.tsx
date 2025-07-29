import { Button } from '@mui/material'
import React, { useState } from 'react'
import { Add as AddIcon } from '@mui/icons-material';
import AddClassSubjectDialog from './AddClassSubjectDialog';
import type { IClassSubject } from '../types/ClassSubject';

interface Props {
    classId: string;
}

const SubjectTab = (props: Props) => {
    const [openAddSubjects, setOpenAddSubjects] = useState<{
        action: 'add' | 'edit',
        open: boolean
    }>({
        action: 'add',
        open: false,
    });


    return (
        <>

            <Button
                variant="contained"
                color="primary"
                sx={{ textTransform: 'none', float: 'right', mt: .5 }}
                startIcon={<AddIcon />}
                onClick={() => {
                    setOpenAddSubjects({
                        action: 'add',
                        open: true
                    })
                }
                }
            >                ADD
            </Button>
            <br />
            <br />
            <br />
            <br />
            <AddClassSubjectDialog classId={props.classId}
                open={openAddSubjects.open}
                onClose={() => setOpenAddSubjects({
                    action: 'add',
                    open: false,
                })}
                onSubmit={function (value: IClassSubject): void {
                    console.log(value);

                }}
            />
        </>
    )
}

export default SubjectTab
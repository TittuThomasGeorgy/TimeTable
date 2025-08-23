import React from 'react';
import { Drawer, Box, Typography, Stack } from '@mui/material';
import type { IRemark } from '../types/Remarks';
import type { ISubject } from '../../subject/types/Subject';
import type { ITeacher } from '../../teacher/types/Teacher';
import TeacherChip from '../../teacher/components/TeacherChip';

interface Props {
  open: boolean;
  onClose: () => void;
  subject: ISubject;
  teacher: ITeacher;
  noOfHours: number;
  totalNoOfHours: number;
  remarks: IRemark[];
}

const RemarkDrawer = (props: Props) => {
  return (
    <Drawer anchor="right" open={props.open} onClose={props.onClose}>
      <Box sx={{ width: { xs: '100vw', sm: 350 }, p: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight="bold">
            {`${props.subject.name} (${props.subject.code})`}
          </Typography>
          <TeacherChip value={props.teacher} disableTeacherNavigate={true} />
          <Typography variant="body2" color="text.secondary">
            {props.noOfHours} / {props.totalNoOfHours} hours assigned
          </Typography>

          <Typography variant="subtitle1">Remarks:</Typography>
          {props.remarks.length > 0 ? (
            <ul>
              {props.remarks.map((remark, indx) => (
                <li key={indx}>
                  <Typography variant="body2">{remark.remark}</Typography>
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="body2" color="text.disabled">
              No remarks yet
            </Typography>
          )}
        </Stack>
      </Box>
    </Drawer>
  );
};

export default RemarkDrawer;

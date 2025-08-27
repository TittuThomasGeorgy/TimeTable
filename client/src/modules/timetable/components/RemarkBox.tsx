import React from 'react';
import { Box, Typography, Stack, Card } from '@mui/material';
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

const RemarkBox = (props: Props) => {
  if (!props.open) return null; // Render nothing if 'open' is false

  return (
    <Card sx={{ width: { xs: '100vw', sm: 350 }, p: 2 }}>
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
                <Typography variant="body2" color={remark.status===-1?'error':'textPrimary'}>{remark.remark}</Typography>
              </li>
            ))}
          </ul>
        ) : (
          <Typography variant="body2" color="text.disabled">
            No remarks yet
          </Typography>
        )}
      </Stack>
    </Card>
  );
};

export default RemarkBox;
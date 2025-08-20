import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material'
import React, { useState } from 'react'
import { periodsList, daysList } from '../constants/Day.default'
import type { IPeriod } from '../types/Period'
import type { IClassSubject } from '../../class/types/ClassSubject';
import type { ITeacher } from '../../teacher/types/Teacher';
import type { ISubject } from '../../subject/types/Subject';
import PeriodCard from './PeriodCard';

interface Props {
    periods: IPeriod[];
    classSubjects: IClassSubject[];
    teachers: ITeacher[];
    subjects: ISubject[];
    selectedClassSubject:string;
    onSelectClassSubject:(selectedSub:string)=>void;

}
const TimetableGrid = (props: Props) => {

    const getClassSub = (id: string) => {
        const classSub = props.classSubjects?.find(clzSub => clzSub._id == id);

        console.log(classSub,'l');
        return classSub ?? null
    }
    const getSubjectCode = (id: string) => {

        const classSub = getClassSub(id);
        if (!classSub) return '-';
        const subject = props.subjects?.find(sub => sub._id == classSub.subject);
        return subject?.code ?? ''
    }

    const getTeacherCode = (id: string) => {

        const classSub = getClassSub(id);
        if (!classSub) return '-';
        const teacher = props.teachers?.find(teacher => teacher._id == classSub.teacher);
        return teacher?.code ?? ''
    }
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        {periodsList.map(period => (
                            <TableCell key={period} align="center">
                                {period}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {daysList.map(day => (
                        <TableRow key={day}>
                            <TableCell>{day}</TableCell>
                            {periodsList.map(period => {
                                const _period: IPeriod | null = props.periods?.find(per => per.day === day && per.period === period) ?? null
                                return (
                                    <TableCell
                                        align="center"
                                    >{
                                            _period?.classSubject ?
                                                <PeriodCard subject={getSubjectCode(_period?.classSubject)} teacher={getTeacherCode(_period?.classSubject)} onClick={()=>props.onSelectClassSubject(_period.classSubject)} selected={_period.classSubject==props.selectedClassSubject}/> : '-'
                                        }
                                    </TableCell>



                                )
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default TimetableGrid
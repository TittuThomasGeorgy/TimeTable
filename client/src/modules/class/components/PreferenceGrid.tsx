// components/PreferenceGrid.tsx
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions, Typography, Grid,
} from '@mui/material';
import type { Day, Period, PreferenceChoice, Preferences } from '../types/Preferences';
import { days, periods } from '../../timetable/constants/Day.default'
import type { ISubject } from '../../subject/types/Subject';
import type { IClassSubject } from '../types/ClassSubject';
import TeacherChip from '../../teacher/components/TeacherChip';
import type { ITeacher } from '../../teacher/types/Teacher';


const getInitialPreferences = (): Preferences[] =>
  days.flatMap(day =>
    periods.map(period => ({
      day,
      period,
      preference: 0 as PreferenceChoice
    }))
  );



const getColor = (pref: PreferenceChoice): string => {
  switch (pref) {
    case 1:
      return '#A5D6A7'; // green
    case -1:
      return '#EF9A9A'; // red
    default:
      return '#E0E0E0'; // grey
  }
};
interface Props {
  value: Preferences[] ;
  onChange:(newVal:Preferences[])=>void;
  // onSubmit: (value: IClassSubject1) => void;
}
const PreferenceGrid = (props: Props) => {
  const [preferences, setPreferences] = useState<Preferences[]>(getInitialPreferences);

  const togglePreference = (day: Day, period: Period) => {
    const current: Preferences = preferences.find(_preference => _preference.day === day && _preference.period == period) as Preferences;

    const next: PreferenceChoice =
      current.preference === 0 ? 1 : current.preference === 1 ? -1 : 0;

    setPreferences(prev => prev.map(pref => (pref.day === day && pref.period === period) ? ({ ...pref, preference: next }) : pref))
  };

  const handleSave = () => {
    console.log('Saving preferences:', preferences);
    // Send preferences to your backend via API
  };
  useEffect(() => {
    console.log('PreferenceDialog mounted');
    return () => {
      console.log('PreferenceDialog unmounted');
    };
  }, []);


  return (    

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  {periods.map(period => (
                    <TableCell key={period} align="center">
                      {period}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {days.map(day => (
                  <TableRow key={day}>
                    <TableCell>{day}</TableCell>
                    {periods.map(period => {
                      const current: Preferences = preferences.find(_preference => _preference.day === day && _preference.period == period) as Preferences;
                      return (
                        <TableCell
                          key={period}
                          align="center"
                          onClick={() => togglePreference(day, period)}
                          sx={{
                            backgroundColor: getColor(current.preference),
                            cursor: 'pointer',
                            transition: '0.2s ease',
                            fontWeight: 'bold',
                          }}
                        >
                          {current.preference == 0 ? '' :
                            current.preference == 1 ? '✓' : '✗'}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

  );
};

export default PreferenceGrid;

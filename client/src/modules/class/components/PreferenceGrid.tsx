// components/PreferenceGrid.tsx
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import type { Day, Period, PreferenceChoice, Preferences } from '../types/Preferences';
import { days, periods } from '../../timetable/constants/Day.default'
import { Close,RadioButtonChecked } from '@mui/icons-material';

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
  value: Preferences[];
  onChange: (newVal: Preferences[]) => void;
  // onSubmit: (value: IClassSubject1) => void;
}
const PreferenceGrid = (props: Props) => {
  const [preferences, setPreferences] = useState<Preferences[]>(getInitialPreferences);

  const togglePreference = (day: Day, period: Period) => {
    const current: Preferences = preferences.find(_preference => _preference.day === day && _preference.period == period) as Preferences;

    const next: PreferenceChoice =
      current.preference === 0 ? 1 : current.preference === 1 ? -1 : 0;
    const _preferences = preferences.map(pref => (pref.day === day && pref.period === period) ? ({ ...pref, preference: next }) : pref)
    setPreferences(_preferences)
    props.onChange(_preferences.filter(pref => pref.preference != 0))
  };


  useEffect(() => {
    if (props.value) {
      const pref = preferences.filter(pref => props.value.find(val => val.day === pref.day && val.period == pref.period) == null)
      setPreferences([...pref, ...props.value])
    } else
      setPreferences(getInitialPreferences)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value])

  

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
                      current.preference == 1 ? <RadioButtonChecked/> : <Close/>}
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

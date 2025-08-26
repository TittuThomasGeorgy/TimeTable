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
import { daysList, periodsList } from '../../timetable/constants/Day.default'
import { Close, RadioButtonChecked } from '@mui/icons-material';

const getInitialPreferences = (): Preferences[] =>
  daysList.flatMap(day =>
    periodsList.map(period => ({
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
      const newPreferences = getInitialPreferences(); // Start with a fresh, initial state
      const updatedPreferences = newPreferences.map(pref => {
        const matchingPref = props.value.find(p => p.day === pref.day && p.period === pref.period);
        if (matchingPref) {
          return { ...pref, preference: matchingPref.preference };
        }
        return pref;
      });
      setPreferences(updatedPreferences);
    } else {
      setPreferences(getInitialPreferences());
    }
  }, [props.value]);



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
                      height: '50px', // Set a fixed height for all cells
                      width: '50px', // Add a fixed width
                      p: 0, // Remove padding to prevent extra space
                    }}
                  >
                    {current.preference == 0 ? '' :
                      current.preference == 1 ? <RadioButtonChecked fontSize='small' /> : <Close fontSize='small' />}
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

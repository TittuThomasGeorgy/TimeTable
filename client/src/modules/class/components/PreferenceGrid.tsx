// components/PreferenceGrid.tsx
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Paper,
  Box,
} from '@mui/material';

type Day = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI';
type Period = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type Preference = 0 | 1 | -1;

type Preferences = Record<Day, Record<Period, Preference>>;

const days: Day[] = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
const periods: Period[] = [1, 2, 3, 4, 5, 6, 7, 8];

const getInitialPreferences = (): Preferences =>
  Object.fromEntries(
    days.map(day => [
      day,
      Object.fromEntries(periods.map(period => [period, 0])) as Record<Period, Preference>,
    ])
  ) as Preferences;

const getColor = (pref: Preference): string => {
  switch (pref) {
    case 1:
      return '#A5D6A7'; // green
    case -1:
      return '#EF9A9A'; // red
    default:
      return '#E0E0E0'; // grey
  }
};

const PreferenceGrid: React.FC = () => {
  const [preferences, setPreferences] = useState<Preferences>(getInitialPreferences);

  const togglePreference = (day: Day, period: Period) => {
    const current = preferences[day][period];
    const next: Preference =
      current === 0 ? 1 : current === 1 ? -1 : 0;

    setPreferences(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [period]: next,
      },
    }));
  };

  const handleSave = () => {
    console.log('Saving preferences:', preferences);
    // Send preferences to your backend via API
  };

  return (
    <Box p={2}>
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
                {periods.map(period => (
                  <TableCell
                    key={period}
                    align="center"
                    onClick={() => togglePreference(day, period)}
                    sx={{
                      backgroundColor: getColor(preferences[day][period]),
                      cursor: 'pointer',
                      transition: '0.2s ease',
                      fontWeight: 'bold',
                    }}
                  >
                    {preferences[day][period] == 0 ? '' :
                     preferences[day][period] == 1 ? '✓' : '✗'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Preferences
        </Button>
      </Box>
    </Box>
  );
};

export default PreferenceGrid;

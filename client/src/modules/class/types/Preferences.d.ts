import type { ISubject } from "../../subject/types/Subject";

type Day = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI';
type Period = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type PreferenceChoice = 0 | 1 | -1;

interface Preferences {
    day: Day;
    period: Period;
    preference: PreferenceChoice;
};

export { Preferences, Day, Period, PreferenceChoice  };

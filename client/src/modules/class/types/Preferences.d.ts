import type { ISubject } from "../../subject/types/Subject";

type Day = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI';
type Period ='I'|'II'|'III'|'IV'|'V'|'VI'|'VII'|'VIII';

type PreferenceChoice = 0 | 1 | -1;

interface Preferences {
    day: Day;
    period: Period;
    preference: PreferenceChoice;
};

export { Preferences, Day, Period, PreferenceChoice  };

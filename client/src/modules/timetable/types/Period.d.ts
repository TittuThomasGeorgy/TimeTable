import { Types } from "mongoose";

type Day = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI';
type Period = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;


export interface IPeriod {
    _id: string;
    timetableId: string;
    classId: string;
    subject: string|ISubject;
    day: Day;
    period: Period;
}
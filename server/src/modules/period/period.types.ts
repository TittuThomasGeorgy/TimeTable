import { Types } from "mongoose";

type Day = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI';
type Period = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;


export interface IPeriod {
    _id: Types.ObjectId;
    timetableId: Types.ObjectId;
    classId: Types.ObjectId;
    subject: Types.ObjectId;
    day: Day;
    period: Period;
}
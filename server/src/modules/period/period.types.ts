import { Types } from "mongoose";

export type DayType = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI';
export type PeriodType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;


export interface IPeriod {
    _id: Types.ObjectId;
    timetableId: Types.ObjectId;
    classSubject:Types.ObjectId;
    class:Types.ObjectId;
    teacher:Types.ObjectId;
    day: DayType;
    period: PeriodType;
}
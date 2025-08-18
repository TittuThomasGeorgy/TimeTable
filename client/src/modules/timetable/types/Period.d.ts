import { Types } from "mongoose";
import type { IClassSubject } from "../../class/types/ClassSubject";

type Day = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI';
type Period = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;


export interface IPeriod {
    _id: string;
    timetableId: string;
    classSubject: IClassSubject;
    class:string;
    teacher:string;
    day: Day;
    period: Period;
}
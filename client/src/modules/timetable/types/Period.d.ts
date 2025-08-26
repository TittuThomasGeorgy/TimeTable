import { Types } from "mongoose";
import type { IClassSubject } from "../../class/types/ClassSubject";

type Day = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI';
type Period = 'I'|'II'|'III'|'IV'|'V'|'VI'|'VII'|'VIII';


export interface IPeriod {
    _id: string;
    timetableId: string;
    classSubject: string;
    class:string;
    teacher:string;
    day: Day;
    period: Period;
}
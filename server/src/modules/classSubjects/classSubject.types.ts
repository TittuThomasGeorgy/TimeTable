import { Types } from "mongoose";
import { ISubject } from "../subject/subject.types";
import { ITeacher } from "../teacher/teacher.types";
import { IClass } from "../class/class.types";

export interface IClassSubject {

    _id: Types.ObjectId;
    class: Types.ObjectId | IClass;
    teacher: Types.ObjectId | ITeacher;
    subject: Types.ObjectId | ISubject;
    noOfHours: number;
    preferences:Preferences[];
}
type Day = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI';
type Period = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type PreferenceChoice = 0 | 1 | -1;

export interface Preferences {
    day: Day;
    period: Period;
    preference: PreferenceChoice;
};
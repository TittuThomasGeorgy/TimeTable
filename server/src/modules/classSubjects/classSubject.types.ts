import { Types } from "mongoose";
import { ISubject } from "../subject/subject.types";
import { ITeacher } from "../teacher/teacher.types";
import { IClass } from "../class/class.types";
import { DayType, PeriodType } from "../period/period.types";

export interface IClassSubject {

    _id: Types.ObjectId;
    class: Types.ObjectId | IClass;
    teacher: Types.ObjectId | ITeacher;
    subject: Types.ObjectId | ISubject;
    noOfHours: number;
    shared?: Types.ObjectId;
    preferences: Preferences[];
}

type PreferenceChoice = 0 | 1 | -1;

export interface Preferences {
    day: DayType;
    period: PeriodType;
    preference: PreferenceChoice;
};
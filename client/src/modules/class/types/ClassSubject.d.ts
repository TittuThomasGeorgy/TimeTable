import type { ISubject } from "../../subject/types/Subject";
import type { ITeacher } from "../../teacher/types/Teacher";
import type { IClass } from "./Class";
import type { Preferences } from "./Preferences";

export interface IClassSubject {

    _id: string;
    class: string|IClass;
    subject: string | ISubject;
    teacher: string | ITeacher;
    noOfHours: number;
    sharedSub?:string;
    sharedClz?:string;
    preferences:Preferences[];
}
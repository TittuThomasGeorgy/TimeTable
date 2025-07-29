import type { ISubject } from "../../subject/types/Subject";
import type { ITeacher } from "../../teacher/types/Teacher";

export interface IClassSubject {

    _id: string;
    class: string;
    subject: string | ISubject;
    teacher: string | ITeacher;
    noOfHours: number;
}
import { Types } from "mongoose";
import { ISubject } from "../subject/subject.types";
import { ITeacher } from "../teacher/teacher.types";
import { IClass } from "../class/class.types";

export interface IClassSubject {

    _id: Types.ObjectId;
    class: Types.ObjectId|IClass;
    teacher: Types.ObjectId|ITeacher;
    subject: Types.ObjectId|ISubject;
    noOfHours: number;
}
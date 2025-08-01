import { Types } from "mongoose";
import { ISubject } from "../subject/subject.types";

export interface IClassSubject {

    _id: Types.ObjectId;
    class: Types.ObjectId;
    teacher: Types.ObjectId;
    subject: Types.ObjectId|ISubject;
    noOfHours: number;
}
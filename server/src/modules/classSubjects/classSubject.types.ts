import { Types } from "mongoose";

export interface IClassSubject {

    _id: Types.ObjectId;
    class: Types.ObjectId;
    teacher: Types.ObjectId;
    subject: Types.ObjectId;
    noOfHours: number;
}
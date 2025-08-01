import { Types } from "mongoose";

export interface IClass {

    _id: Types.ObjectId;
    name: string;
    div: string;
    classTeacher:Types.ObjectId;
}
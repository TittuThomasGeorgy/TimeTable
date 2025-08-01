import { Types } from "mongoose";

export interface IClass {

    _id: Types.ObjectId;
    name: number;
    div: string;
    classTeacher:Types.ObjectId;
}
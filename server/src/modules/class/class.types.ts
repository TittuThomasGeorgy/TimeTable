import { Types } from "mongoose";

export interface IClass {

    _id: Types.ObjectId;
    name: string;
    classTeacher:Types.ObjectId;
}
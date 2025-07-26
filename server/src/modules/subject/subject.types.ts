import { Types } from "mongoose";

export interface ISubject {
    _id: Types.ObjectId;
    name: string;
    code:string;
}
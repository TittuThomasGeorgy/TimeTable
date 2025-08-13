import { Types } from "mongoose";

export interface ITimetable {
    _id: Types.ObjectId;
    name: string;
    code: string;
    isActive: boolean;
}
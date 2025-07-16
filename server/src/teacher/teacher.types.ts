import { Types } from "mongoose";

export interface ITeacher {

    _id: Types.ObjectId;
    name: string;
    exp: number;
    image: string;
    isAdmin: boolean;
    username: string;
    password?: string;
    code: string
}
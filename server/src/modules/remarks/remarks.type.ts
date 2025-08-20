import { Types } from "mongoose";

export interface IRemark {
    _id: Types.ObjectId;
    timetableId: Types.ObjectId;
    classSubject: Types.ObjectId;
    remark: string;
    status:0|1|-1;
}
import type { Dayjs } from "dayjs";

export interface IRemark {
    _id: string;
    timetableId: string;
    class: string;
    classSubject: string;
    remark: string;
    status:0|1|-1;
    createdAt:Dayjs;
}
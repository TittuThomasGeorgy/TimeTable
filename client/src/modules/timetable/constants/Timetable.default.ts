import dayjs from "dayjs";
import type { ITimetable } from "../types/Timetable";

export const defTimetable: ITimetable= {
    _id: "",
    name: "",
    isActive: false,
    createdAt: dayjs()
}

import { getResponse } from "../../../services/api";
import http from "../../../services/http";
import type { ITimetable } from "../types/Timetable";


export const createTimetable = async (data: ITimetable) =>
    getResponse<ITimetable>(http.post(`/timetable/`, { ...data }))
export const getTimetables = async () =>
    getResponse<ITimetable[]>(http.get(`/timetable/`))
export const getTimetableById = async (id: string) =>
    getResponse<ITimetable>(http.get(`/timetable/${id}`))
export const updateTimetable = async (data: ITimetable) =>
    getResponse<ITimetable>(http.patch(`/timetable/${data._id}`, data))
export const deleteTimetable = async (id: string,) =>
    getResponse<ITimetable>(http.delete(`/timetable/${id}`))

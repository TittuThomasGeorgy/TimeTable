import { getResponse } from "../../../services/api";
import http from "../../../services/http";
import type { IPeriod } from "../types/Period";


export const getPeriodsById = async (timetableId:string) =>
    getResponse<IPeriod[]>(http.get(`/period/`,{ params: {timetableId } }))
export const shufflePeriodsById = async (timetableId:string) =>
    getResponse<IPeriod[]>(http.post(`/period/${timetableId}`))
export const shufflePeriodsByClassId = async (timetableId: string, classId: string) =>
    getResponse<IPeriod[]>(http.post(`/period/shuffle/${classId}`, { timetableId, classId }))

export const getPeriodByClzId = async (id: string) =>
    getResponse<IPeriod[]>(http.get(`/period/class/${id}`))
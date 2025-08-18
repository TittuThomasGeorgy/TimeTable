import { getResponse } from "../../../services/api";
import http from "../../../services/http";
import type { IPeriod } from "../types/Period";


export const getPeriodsById = async (timetableId:string) =>
    getResponse<IPeriod[]>(http.get(`/period/`,{ params: {timetableId } }))

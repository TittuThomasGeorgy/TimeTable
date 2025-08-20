import { getResponse } from "../../../services/api";
import http from "../../../services/http";
import type { IRemark } from "../types/Remarks";


export const getRemarksById = async (timetableId:string) =>
    getResponse<IRemark[]>(http.get(`/remark/`,{ params: {timetableId } }))

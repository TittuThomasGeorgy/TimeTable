import type { ITeacher } from "../types/Teacher";
import { getResponse } from "../../../services/api";
import http from "../../../services/http";


export const createTeacher = async (data: ITeacher) =>
    getResponse<ITeacher>(http.post(`/teachers/`, { ...data }))

import type { IClass } from "../types/Class";
import { getResponse } from "../../../services/api";
import http from "../../../services/http";


export const createClass = async (data: IClass) =>
    getResponse<IClass>(http.post(`/classes/`, { ...data }))
export const getClasses = async () =>
    getResponse<IClass[]>(http.get(`/classes/`))
export const getClassById = async (id: string) =>
    getResponse<IClass>(http.get(`/classes/${id}`))
export const updateClass = async (data: IClass) =>
    getResponse<IClass>(http.patch(`/classes/${data._id}`, data))

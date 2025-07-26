import { getResponse } from "../../../services/api";
import http from "../../../services/http";
import type { ISubject } from "../types/Subject";


export const createSubject = async (data: ISubject) =>
    getResponse<ISubject>(http.post(`/subjects/`, { ...data }))
export const getSubjects = async () =>
    getResponse<ISubject[]>(http.get(`/subjects/`))
export const getSubjectById = async (id: string) =>
    getResponse<ISubject>(http.get(`/subjects/${id}`))
export const updateSubject = async (data: ISubject) =>
    getResponse<ISubject>(http.patch(`/subjects/${data._id}`, data))

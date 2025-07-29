import { getResponse } from "../../../services/api";
import http from "../../../services/http";
import type { IClassSubject } from "../types/ClassSubject";


export const createClassSSubject = async (data: IClassSubject) =>
    getResponse<IClassSubject>(http.post(`/class_sub/`, { ...data }))
export const getClassSubjects = async (classId: string) =>
    getResponse<IClassSubject>(http.get(`/class_sub/${classId}`))
export const updateClassSubject = async (data: IClassSubject) =>
    getResponse<IClassSubject>(http.patch(`/class_sub/${data._id}`, data))

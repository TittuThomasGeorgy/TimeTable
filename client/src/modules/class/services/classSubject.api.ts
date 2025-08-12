import { getResponse } from "../../../services/api";
import http from "../../../services/http";
import type { IClassSubject } from "../types/ClassSubject";
import type { IImportFrom } from "../types/ImportFrom";


export const createClassSSubject = async (data: IClassSubject) =>
    getResponse<IClassSubject>(http.post(`/class_sub/`, { ...data }))
export const getClassSubjects = async (classId: string, type: 'class' | 'teacher' | 'subject') =>
    getResponse<IClassSubject[]>(http.get(`/class_sub/${classId}`, { params: { type } }))
export const updateClassSubject = async (data: IClassSubject) =>
    getResponse<IClassSubject>(http.patch(`/class_sub/${data._id}`, data))
export const importClassSubject = async (importFrom: IImportFrom) =>
    getResponse<{ alreadyExists: string[], successfulImports: string[] }>(http.post(`/class_sub/${importFrom.to}`, importFrom))
export const deleteClassSubject = async (classSubId: string,) =>
    getResponse<IClassSubject>(http.delete(`/class_sub/${classSubId}`))

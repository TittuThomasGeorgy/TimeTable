import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClassSSubject, deleteClassSubject, getAllClassSubjects, getClassSubjects, importClassSubject, updateClassSubject } from '../services/classSubject.api';
import type { IImportFrom } from '../types/ImportFrom';

export const useGetAllClassSubjects = () => {
  return useQuery({
    queryKey: ['AllClassSubjects'],
    queryFn: getAllClassSubjects,
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes (optional)
  });
};
export const useGetClassSubjects = (id: string, type: 'class' | 'teacher' | 'subject') => {
  return useQuery({
    queryKey: ['classSubjects', id, type], // Include id in the queryKey to re-fetch when id changes
    queryFn: () => getClassSubjects(id, type), // Pass the id to your queryFn
    enabled: !!id, // Optional: Only run the query if id is truthy
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes (optional)
  });
};

export const useCreateClassSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClassSSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classSubjects'] });
    },
  });
}

export const useUpdateClassSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClassSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classSubjects'] });
    },
  });
};
export const useImportClassSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (importFrom: IImportFrom) => importClassSubject(importFrom),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classSubjects'] });
    },
  });
};
export const useDeleteClassSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteClassSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classSubjects'] });
    },

  });
};
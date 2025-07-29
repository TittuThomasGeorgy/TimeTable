import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClassSSubject,  getClassSubjects, updateClassSubject } from '../services/classSubject.api';


export const useGetClassSubjects = (id: string) => {
    return useQuery({
        queryKey: ['classSubjects', id], // Include id in the queryKey to re-fetch when id changes
        queryFn: () => getClassSubjects(id), // Pass the id to your queryFn
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
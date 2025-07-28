import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSubjects, getSubjectById, createSubject, updateSubject } from '../services/subject.api';


export const useGetSubjects = () => {
    return useQuery({
        queryKey: ['Subjects'], queryFn: getSubjects,
        staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes (optional)
    });
};
export const useGetSubjectById = (id: string) => {
    return useQuery({
        queryKey: ['ViewSubject', id], // Include id in the queryKey to re-fetch when id changes
        queryFn: () => getSubjectById(id), // Pass the id to your queryFn
        enabled: !!id, // Optional: Only run the query if id is truthy
        staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes (optional)
    });
};

export const useCreateSubject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSubject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Subjects'] });
        },
    });
}

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ViewSubject'] });
    },
  });
};
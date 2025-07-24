import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTeacher, getTeacherById, getTeachers, updateTeacher } from '../services/teacher.api';

export const useGetTeachers = () => {
    return useQuery({
        queryKey: ['Teachers'], queryFn: getTeachers,
        staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes (optional)
    });
};
export const useGetTeacherById = (id: string) => {
    return useQuery({
        queryKey: ['ViewTeacher', id], // Include id in the queryKey to re-fetch when id changes
        queryFn: () => getTeacherById(id), // Pass the id to your queryFn
        enabled: !!id, // Optional: Only run the query if id is truthy
        staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes (optional)
    });
};

export const useCreateTeacher = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTeacher,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Teachers'] });
        },
    });
}

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ViewTeacher'] });
    },
  });
};
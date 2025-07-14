import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTeacher } from '../services/teacher.api';
import type { ITeacher } from '../types/Teacher';


// export const useTeachers = () => {
//     return useQuery({ queryKey: ['Teachers'], queryFn: getTeachers });
// };

export const useCreateTeacher = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTeacher,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Teachers'] });
        },
    });
}

// export const useUpdateTeacher = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ id, data }: { id: string; data: Partial<ITeacher> }) => updateTeacher(id, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['Teachers'] });
//     },
//   });
// };
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClass, getClassById, getClasses, updateClass } from '../services/class.api';
import type { IClass } from '../types/Class';


export const useGetClasses = () => {
    return useQuery({
        queryKey: ['Classes'], queryFn: getClasses,
        staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes (optional)
    });
};
export const useGetClassById = (id: string) => {
    return useQuery({
        queryKey: ['ViewClass', id], // Include id in the queryKey to re-fetch when id changes
        queryFn: () => getClassById(id), // Pass the id to your queryFn
        enabled: !!id, // Optional: Only run the query if id is truthy
        staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes (optional)
    });
};

export const useCreateClass = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createClass,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Classes'] });
        },
    });
}

export const useUpdateClass = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateClass,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ViewClass'] });
            queryClient.invalidateQueries({ queryKey: ['Classes'] });

        },
    });
};
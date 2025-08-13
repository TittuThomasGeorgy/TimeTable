import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTimetables, getTimetableById, createTimetable, updateTimetable } from '../services/timetable.api';


export const useGetTimetables = () => {
    return useQuery({
        queryKey: ['Timetables'], queryFn: getTimetables,
        staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes (optional)
    });
};
export const useGetTimetableById = (id: string) => {
    return useQuery({
        queryKey: ['ViewTimetable', id], // Include id in the queryKey to re-fetch when id changes
        queryFn: () => getTimetableById(id), // Pass the id to your queryFn
        enabled: !!id, // Optional: Only run the query if id is truthy
        staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes (optional)
    });
};

export const useCreateTimetable = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTimetable,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Timetables'] });
        },
    });
}

export const useUpdateTimetable = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateTimetable,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ViewTimetable'] });
            queryClient.invalidateQueries({ queryKey: ['Timetables'] });

        },
    });
};
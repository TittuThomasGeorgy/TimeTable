import {  useMutation, useQuery, useQueryClient,  } from '@tanstack/react-query';
import { getPeriodByClzId, getPeriodsById, shufflePeriodsByClassId, shufflePeriodsById } from '../services/periods.api';


export const useGetPeriods = (id: string) => {
    return useQuery({
        queryKey: ['Periods', id], // Include id in the queryKey to re-fetch when id changes
        queryFn: () => getPeriodsById(id), // Pass the id to your queryFn
        enabled: !!id, // Optional: Only run the query if id is truthy
        staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes (optional)
    });
};
export const useShufflePeriods = () => {
        const queryClient = useQueryClient();
    
        return useMutation({
                    mutationFn: (id: string) =>  shufflePeriodsById(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['Periods'] });
                queryClient.invalidateQueries({ queryKey: ['Remarks'] });
    
            },
        });

};
export const useShufflePeriodsByClz = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ timetableId, classId }: { timetableId: string, classId: string }) =>
            shufflePeriodsByClassId(timetableId, classId),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Periods'] });
            queryClient.invalidateQueries({ queryKey: ['Remarks'] });
        },
    });
};

export const useGetPeriodByClzId = (id: string) => {
    return useQuery({
        queryKey: ['Periods', id], // Include id in the queryKey to re-fetch when id changes
        queryFn: () => getPeriodByClzId(id), // Pass the id to your queryFn
        enabled: !!id, // Optional: Only run the query if id is truthy
        staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes (optional)
    });
};
// export const useUpdatePeriod = () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: updatePeriod,
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['ViewPeriod'] });
//             queryClient.invalidateQueries({ queryKey: ['Periods'] });

//         },
//     });
// };
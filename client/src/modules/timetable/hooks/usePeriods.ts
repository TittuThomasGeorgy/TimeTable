import {  useQuery,  } from '@tanstack/react-query';
import { getPeriodsById } from '../services/periods.api';


export const useGetPeriods = (id: string) => {
    return useQuery({
        queryKey: ['Periods', id], // Include id in the queryKey to re-fetch when id changes
        queryFn: () => getPeriodsById(id), // Pass the id to your queryFn
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
import {  useQuery,  } from '@tanstack/react-query';
import { getRemarksById } from '../services/remarks.api';


export const useGetRemarks = (id: string) => {
    return useQuery({
        queryKey: ['Remarks', id], // Include id in the queryKey to re-fetch when id changes
        queryFn: () => getRemarksById(id), // Pass the id to your queryFn
        enabled: !!id, // Optional: Only run the query if id is truthy
        staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes (optional)
    });
};


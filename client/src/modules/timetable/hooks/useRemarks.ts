import {  useQuery,  } from '@tanstack/react-query';
import { getRemarksById } from '../services/remarks.api';


export const useGetRemarks = (timeTableId: string, classSubjectId: string) => {
    return useQuery({
        queryKey: ['Remarks', timeTableId, classSubjectId], // Include both IDs in the queryKey
        queryFn: ({ queryKey }) => { // Destructure queryKey from the context object
            const [, timeTableId, classSubjectId] = queryKey;
            return getRemarksById(timeTableId, classSubjectId);
        },
        enabled: !!timeTableId && !!classSubjectId, // Only run the query if both IDs are truthy
        staleTime: 5 * 60 * 1000,
    });
};
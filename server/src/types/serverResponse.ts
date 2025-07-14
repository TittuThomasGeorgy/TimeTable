export type ServerResponse<T> = {
    success?: boolean;
    error?: unknown;
    message: string;
    data?: T;
};
export type HTTP_STATUS_CODE_TYPE =
    | 'OK'
    | 'CREATED'
    | 'PROCESSING'
    | 'BAD REQUEST'
    | 'CONFLICT'
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'NOT FOUND'
    | 'UNSUPPORTED MEDIA TYPE'
    | 'INTERNAL SERVER ERROR'
    | 'NOT IMPLEMENTED'
    | 'SERVICE UNAVAILABLE';

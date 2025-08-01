import type { EnqueueSnackbar } from "notistack";
import type { AxiosResponse } from "axios";
import type { LoaderContextType } from "../types/LoaderContextType";
import type { ServerResponse } from "../types/ServerResponse";
import axios from "axios";

let loader: LoaderContextType;
let enqueueSnackbar: EnqueueSnackbar;

const CommonServices = {
    setLoader: (_loader: LoaderContextType) => (loader = _loader),
    setEnqueueSnackbar: (_enqueueSnackbar: EnqueueSnackbar) => (enqueueSnackbar = _enqueueSnackbar),
};

const getResponse = async <T>(
    axiosCall: Promise<AxiosResponse<unknown>>,
): Promise<ServerResponse<T>> => {
    loader?.onLoad();
    try {
        const res = await axiosCall;
        const result: ServerResponse<T> = res.data as ServerResponse<T>;
        // const parsed = responseFormatter?.((res.data as ServerResponse<T>).data);
        // if (parsed) result = { ...result, data: parsed };
        return result;
    } catch (err: unknown) {
        let message = "Something went wrong";

        if (axios.isAxiosError(err)) {
            // Typed as AxiosError
            const errorData = err.response?.data;
            message = errorData?.message ?? err.message;
        } else if (err instanceof Error) {
            message = err.message;
        }

        enqueueSnackbar?.({
            message,
            variant: "error",
        });

        throw err;
    } finally {
        loader?.offLoad();
    }
}

export { CommonServices, getResponse };

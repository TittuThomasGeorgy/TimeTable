
import React, { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useLoader } from "../hooks/useLoader";
import { CommonServices } from "../services/api";

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const loader = useLoader();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    CommonServices.setLoader(loader);
    CommonServices.setEnqueueSnackbar(enqueueSnackbar);
  }, [loader, enqueueSnackbar]);

  return <>{children}</>;
};

export default AppInitializer;

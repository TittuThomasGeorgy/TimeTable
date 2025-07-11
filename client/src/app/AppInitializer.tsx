
import React, { useEffect } from "react";
import { useSnackbar } from "notistack";
import api from "../services/api";
import { useLoader } from "../hooks/useLoader";

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const loader = useLoader();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    api.setLoader(loader);
    api.setEnqueueSnackbar(enqueueSnackbar);
  }, [loader, enqueueSnackbar]);

  return <>{children}</>;
};

export default AppInitializer;

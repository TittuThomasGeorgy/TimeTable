export    interface ModuleRoute {
      base: string;
      pages: {
        title: string;
        path: string;
        element: JSX.Element;
        showInDrawer?: boolean;
        icon?: React.ReactNode;
      }[];
    }

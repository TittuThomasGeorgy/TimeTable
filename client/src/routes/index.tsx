import { createBrowserRouter, type RouteObject, RouterProvider } from 'react-router-dom';
import { allModuleRoutes } from './routes';

const Router = () => {




  const router = createBrowserRouter(
    ([] as RouteObject[]).concat(
      ...allModuleRoutes.map((moduleRoute) =>
        moduleRoute.pages.map((page) => ({
          path: moduleRoute.base + page.path,
          element:
            // school === null ?
            //   <LoadingPage /> :
            //   school == false ?
            //     <LoginPage /> :
            page.element
          // element: page.element,
        })))));
  return <RouterProvider router={router} />;
};

export default Router;

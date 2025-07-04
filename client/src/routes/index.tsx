import { createBrowserRouter, type RouteObject, RouterProvider } from 'react-router-dom';
import { allModuleRoutes } from './routes';

const Router = () => {

 


  const router = createBrowserRouter(
    ([] as RouteObject[]).concat(
      ...allModuleRoutes.map((page) =>
      ({
        path: page.path,
        element: 
            page.element
        // element: page.element,
        // element: page.element,
      }))));
  return <RouterProvider router={router} />;
};

export default Router;

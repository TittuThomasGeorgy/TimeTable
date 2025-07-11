import { createBrowserRouter, type RouteObject, RouterProvider } from 'react-router-dom';
import { allModuleRoutes } from './routes';
import ErrorPage from '../pages/ErrorPage';
import NotFoundPage from '../pages/NotFoundPage';

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
            page.element,
          // element: page.element,
          errorElement: <ErrorPage />,
        }))),
      [
        {
          path: '*',
          element: <NotFoundPage />, // 👈 Catch-all route for 404s
        },
      ]));
  return <RouterProvider router={router} />;
};

export default Router;

import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import New from "./pages/dashboard/new";
import Instrument from "./pages/instrument";

import Layout from "./components/layout";
import { PrivateRoutes } from "../src/privateRoutes/PrivateRoutes";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/produto/:id",
        element: <Instrument />,
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoutes>
            <Dashboard />
          </PrivateRoutes>
        ),
      },
      {
        path: "/dashboard/novo",
        element: (
          <PrivateRoutes>
            <New />
          </PrivateRoutes>
        ),
      },
    ],
  },

  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/cadastro",
    element: <Register />,
  },
]);

export default router;

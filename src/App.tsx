import { FC, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Provider as MobxProvider } from "mobx-react";

import theme from "configs/theme";
import pages from "configs/pages";
import { store } from "store";
import * as elements from "pages";
import { GeneralLayout } from "components/layouts";

const App: FC = () => {
  const getRoutes = () => {
    return pages.map((value) => {
      const Elements = { ...elements } as unknown as { [key: string]: FC<any> };
      const ElementFound = Elements[value.name.replaceAll(" ", "")];

      return {
        path: value.path,
        element: ElementFound ? <ElementFound /> : <div>Coming Soon</div>,
      };
    });
  };

  const router = createBrowserRouter([{ path: "/", element: <GeneralLayout />, children: getRoutes() }]);

  return (
    <Suspense fallback={"..."}>
      <MobxProvider {...store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </MobxProvider>
    </Suspense>
  );
};

export default App;

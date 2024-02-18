export { PageShell };

import React from "react";
import { PageContextProvider } from "./usePageContext";
import type { PageContext } from "vike/types";
import "./scss/app.scss";
import "./css/index.css";

function PageShell({
  children,
  pageContext,
}: {
  children: React.ReactNode;
  pageContext: PageContext;
}) {
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
          {children}
      </PageContextProvider>
    </React.StrictMode>
  );
}


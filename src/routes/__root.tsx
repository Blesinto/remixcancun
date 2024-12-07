import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { QueryClient } from "@tanstack/react-query";

import React, { Suspense } from "react";
import { ConnectWallet } from "@/components/connect-wallet";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/">Start Over</Link>
      </div>
    );
  },
});

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        }))
      );

function RootComponent() {
  return (
    <>
      <header className="flex sticky h-16 shrink-0 items-center justify-between gap-2 mb-4 border-b px-4">
        <h1 className="text-3xl font-bold">EVM dApp</h1>
        <nav className="flex gap-4 text-lg items-center">
          <Link
            to="/"
            activeProps={{
              className: "font-bold",
            }}
            activeOptions={{ exact: true }}
          >
            Mint
          </Link>{" "} <Link
            to="/makertplace"
            activeProps={{
              className: "font-bold",
            }}
            activeOptions={{ exact: true }}
          >
            Makertplace
          </Link>{" "}
        </nav>
        <ConnectWallet />
      </header>

      <Outlet />
      <ReactQueryDevtools buttonPosition="bottom-right" />
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  );
}

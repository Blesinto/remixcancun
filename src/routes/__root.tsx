import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { QueryClient } from '@tanstack/react-query';

import React, { Suspense } from 'react';
// import { ConnectWallet } from '@/components/connect-wallet';
import Navbar from '@/components/Layout/Navbar';
// import Hero from '@/components/Layout/Hero';
import Footer from '../components/Layout/Footer';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to='/'>Start Over</Link>
      </div>
    );
  },
});

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import('@tanstack/router-devtools').then(res => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        }))
      );

function RootComponent() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer/>

      <ReactQueryDevtools buttonPosition='bottom-right' />
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  );
}

import { Link, createRootRouteWithContext } from '@tanstack/react-router';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { QueryClient } from '@tanstack/react-query';

// import React, { Suspense } from 'react';
import { ConnectWallet } from '@/components/connect-wallet';

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

// const TanStackRouterDevtools =
//   process.env.NODE_ENV === 'production'
//     ? () => null // Render nothing in production
//     : React.lazy(() =>
//         // Lazy load in development
//         import('@tanstack/router-devtools').then(res => ({
//           default: res.TanStackRouterDevtools,
//           // For Embedded Mode
//           // default: res.TanStackRouterDevtoolsPanel
//         }))
//       );

function RootComponent() {
  return (
    <>
      <header className='fixed top-0 left-0 right-0 md:flex flex-col md:flex-row justify-between px-2 py-2 md:px-[8rem] md:py-[1.2rem] text-white shadow-lg bg-[#23054d] z-50'>
        <h1 className='text-3xl font-bold'>Remixcancu</h1>
        {/* navbar  */}
        <nav className='flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0'>
          <ul className='flex items-center justify-center space-x-6'>
            <li>
              <Link
                to='/'
                activeProps={{
                  className:
                    'font-bold hover:text-[#2F80ED] transition duration-300',
                }}
                activeOptions={{ exact: true }}
              >
                Marketplace
              </Link>
            </li>
            <li>
              <Link
                to='/'
                activeProps={{
                  className:
                    'font-bold hover:text-[#2F80ED] transition duration-300',
                }}
                activeOptions={{ exact: true }}
              >
                Collection
              </Link>
            </li>
            <li>
              <Link
                to='/'
                activeProps={{
                  className:
                    'font-bold hover:text-[#2F80ED] transition duration-300',
                }}
                activeOptions={{ exact: true }}
              >
                community
              </Link>
            </li>
            <li>
              <Link
                to='/'
                activeProps={{
                  className:
                    'font-bold hover:text-[#2F80ED] transition duration-300',
                }}
                activeOptions={{ exact: true }}
              >
                create
              </Link>
            </li>
            <li>
              <ConnectWallet />
            </li>
          </ul>
        </nav>
      </header>

    

      {/* <ReactQueryDevtools buttonPosition='bottom-right' />
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense> */}
    </>
  );
}

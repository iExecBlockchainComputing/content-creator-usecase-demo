import {
  Outlet,
  createRootRoute,
  Navigate,
  useScrollRestoration,
} from '@tanstack/react-router';
import { useWatchWagmiAccount } from '../hooks/useWatchWagmiAccount.ts';

export const Route = createRootRoute({
  component: () => <RootComponent />,
  notFoundComponent: () => <Navigate to="/" />,
});

const RootComponent = () => {
  useWatchWagmiAccount();
  useScrollRestoration();
  return <Outlet />;
};

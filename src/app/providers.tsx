'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Correctly reference the WalletConnectionProvider
const WalletConnectionProvider = dynamic(
  () => import('./WalletConnectionProvider').then(mod => mod.default),
  {
    ssr: false,
  }
);

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return <WalletConnectionProvider>{children}</WalletConnectionProvider>;
}
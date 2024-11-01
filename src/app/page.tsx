'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import TokenGateAuth from '@/components/token-gate-auth';
import VotingComponent from '@/components/voting-component';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { publicKey } = useWallet();

  return (
    <main className="container mx-auto p-4">
      <TokenGateAuth 
        onAuthenticated={() => setIsAuthenticated(true)} 
      />
      {isAuthenticated && publicKey && (
        <VotingComponent walletAddress={publicKey.toString()} />
      )}
    </main>
  );
}
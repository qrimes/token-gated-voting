'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { checkTokenBalance } from '@/lib/helius';

const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || 'EqsBaDzag9bB9Tkck8kBXtQj4DdXTSr7S5V3aH3nVfZr';

interface TokenGateAuthProps {
  onAuthenticated: () => void;
}

export default function TokenGateAuth({ onAuthenticated }: TokenGateAuthProps) {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyToken = async () => {
    if (!publicKey) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Starting verification...');
      console.log('Wallet address:', publicKey.toString());
      console.log('Token address:', TOKEN_ADDRESS);
      
      const hasToken = await checkTokenBalance(publicKey.toString(), TOKEN_ADDRESS);
      
      console.log('Verification result:', hasToken);
      
      if (hasToken) {
        onAuthenticated();
      } else {
        setError('You need to hold the required token to access this platform');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Failed to verify token ownership');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gray-900 border-gray-800 text-white">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="text-5xl font-bold text-white text-center gothic-text">
          Private Asset Wealth Group
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="flex justify-center">
          <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700 transition-colors" />
        </div>
        
        {publicKey && (
          <div className="space-y-2">
            <p className="text-sm text-center text-gray-400">
              Connected: {publicKey.toString().slice(0, 6)}...{publicKey.toString().slice(-4)}
            </p>
            <button
              onClick={verifyToken}
              disabled={loading}
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 
                       disabled:opacity-50 transition-colors duration-200 ease-in-out"
            >
              {loading ? 'Verifying...' : 'Verify Token'}
            </button>
          </div>
        )}

        {loading && (
          <Alert className="bg-gray-800 border-indigo-900">
            <AlertDescription className="text-gray-300">
              Checking token balance...
            </AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert variant="destructive" className="bg-red-900/20 border-red-800">
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-800">
          <p>Required Token: <span className="font-mono">{TOKEN_ADDRESS}</span></p>
        </div>
      </CardContent>
    </Card>
  );
}
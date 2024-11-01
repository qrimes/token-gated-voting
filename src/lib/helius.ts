// src/lib/helius.ts
const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
const RPC_URL = `https://rpc.helius.xyz/?api-key=${HELIUS_API_KEY}`;

export const checkTokenBalance = async (walletAddress: string, tokenAddress: string) => {
  try {
    console.log('Checking balance for wallet:', walletAddress);
    console.log('Looking for token:', tokenAddress);
    console.log('API Key loaded:', !!HELIUS_API_KEY);

    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'token-balance',
        method: 'getTokenAccountsByOwner',
        params: [
          walletAddress,
          {
            programId: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb' // SPL Token-2022 program ID
          },
          {
            encoding: 'jsonParsed'
          }
        ],
      }),
    });

    const data = await response.json();
    console.log('Full API Response:', data);

    // Check for the token in the accounts
    const hasToken = data.result?.value?.some((account: any) => {
      const tokenData = account.account.data.parsed.info;
      const isCorrectMint = tokenData.mint === tokenAddress;
      const balance = parseFloat(tokenData.tokenAmount?.amount || '0');
      
      console.log('Token check:', {
        mint: tokenData.mint,
        balance,
        isCorrectMint,
        hasBalance: balance > 0
      });
      
      return isCorrectMint && balance > 0;
    });

    console.log('Has token result:', hasToken);
    return !!hasToken;

  } catch (error) {
    console.error('Error checking token balance:', error);
    throw error;
  }
};
import { NextResponse } from 'next/server';



interface VoteSubmission {

  walletAddress: string;

  answer: string;

  questionId: string;

  timestamp: number;

}



interface KVKey {

  name: string;

}



// Use environment variable directly instead of global binding

const KV_URL = "https://api.cloudflare.com/client/v4/accounts/9dd82b3f72d32e444227cb17ce8edc41/storage/kv/namespaces/8bd3fe27eaa445928ba9e6e704dc358e";

const KV_TOKEN = process.env.CLOUDFLARE_API_TOKEN;



async function putKV(key: string, value: string) {

  console.log('Attempting to store value with key:', key);

  console.log('Using KV_URL:', KV_URL);

  console.log('Token available:', !!KV_TOKEN);

  

  const response = await fetch(`${KV_URL}/values/${key}`, {

    method: 'PUT',

    headers: {

      'Authorization': `Bearer ${KV_TOKEN}`,

      'Content-Type': 'text/plain',

    },

    body: value,

  });

  

  if (!response.ok) {

    const errorText = await response.text();

    console.error('KV storage error:', errorText);

    throw new Error(`Failed to store value: ${response.statusText}. Details: ${errorText}`);

  }

}



async function getKV(key: string) {

  const response = await fetch(`${KV_URL}/values/${key}`, {

    headers: {

      'Authorization': `Bearer ${KV_TOKEN}`,

    },

  });

  

  if (!response.ok) {

    throw new Error(`Failed to get value: ${response.statusText}`);

  }

  

  return response.text();

}



async function listKV(prefix: string) {

  const response = await fetch(`${KV_URL}/keys?prefix=${prefix}`, {

    headers: {

      'Authorization': `Bearer ${KV_TOKEN}`,

    },

  });

  

  if (!response.ok) {

    throw new Error(`Failed to list keys: ${response.statusText}`);

  }

  

  const data = await response.json();

  return data.result;

}



export async function POST(request: Request) {

  try {

    const body = await request.json();

    const { walletAddress, answer, questionId } = body;



    if (!walletAddress || !answer || !questionId) {

      return NextResponse.json(

        { error: 'Missing required fields' },

        { status: 400 }

      );

    }



    const submission: VoteSubmission = {

      walletAddress,

      answer,

      questionId,

      timestamp: Date.now(),

    };



    const key = `vote:${questionId}:${walletAddress}`;

    await putKV(key, JSON.stringify(submission));



    return NextResponse.json({ success: true });

  } catch (error) {

    console.error('Failed to store vote:', error);

    return NextResponse.json(

      { error: 'Failed to store vote: ' + (error instanceof Error ? error.message : String(error)) },

      { status: 500 }

    );

  }

}



export async function GET(request: Request) {

  try {

    const { searchParams } = new URL(request.url);

    const questionId = searchParams.get('questionId');



    if (!questionId) {

      return NextResponse.json(

        { error: 'Question ID is required' },

        { status: 400 }

      );

    }



    const prefix = `vote:${questionId}:`;

    const keys = await listKV(prefix);

    const votes = await Promise.all(

      keys.map(async (key: KVKey) => {

        const value = await getKV(key.name);

        return value ? JSON.parse(value) : null;

      })

    );



    return NextResponse.json({ votes: votes.filter(Boolean) });

  } catch (error) {

    console.error('Failed to fetch votes:', error);

    return NextResponse.json(

      { error: 'Failed to fetch votes: ' + (error instanceof Error ? error.message : String(error)) },

      { status: 500 }

    );

  }

} 



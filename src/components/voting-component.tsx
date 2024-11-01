'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from "@/components/ui/textarea";

interface VotingComponentProps {
  walletAddress: string;
}

export default function VotingComponent({ walletAddress }: VotingComponentProps) {
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const votingQuestion = {
    id: '1',
    question: 'Lets chat',
    description: 'One submission per wallet address.',
    endDate: '2024-11-05'
  };

  const fetchVotes = async () => {
    try {
      const response = await fetch(`/api/votes?questionId=${votingQuestion.id}`);
      const data = await response.json();
      if (data.votes) {
        setSubmissions(data.votes);
      }
    } catch (err) {
      console.error('Failed to fetch votes:', err);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  const submitVote = async () => {
    try {
      setLoading(true);
      if (!answer.trim()) {
        setError('Please provide an answer before submitting');
        return;
      }

      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          answer,
          questionId: votingQuestion.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit vote');
      }

      await fetchVotes(); // Refresh the votes
      setVoted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit vote');
      console.error('Vote submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <img 
              src="/pawg-anime.png" 
              alt="PAWG Mascot" 
              className="h-32 w-32 object-contain"
            />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">
            gm PAWGers, as the first DAO question, I'd like to get to know the holders. Also to gather initial thoughts on what we should do. Start a twitter? Telegram? <br/><br/> 
            
            If you hold 1 PAWG, hold 20,000,000 PAWG I'll read your submissions.<br/><br/>
            
             Eventually, # of tokens held will determine your voting power. I'll continue to run the fund based on community votes. Unless the decisions are retarded then I'll just buy the first coin on pumpfun I see and pray 😂 Maybe I'll just make an AI to run it? But for real, LMK what you think about DAOs.fun or tell me to go fuck myself, either way I'll read it! <br/><br/>q</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{votingQuestion.question}</CardTitle>
          <p className="text-sm text-gray-500">Ends: {votingQuestion.endDate}</p>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-gray-400">{votingQuestion.description}</p>
          {!voted ? (
            <div className="space-y-4">
              <Textarea
                placeholder="QRIME CAPITAL DO SOMETHING..."
                className="min-h-[150px] bg-gray-900 border-gray-700 text-gray-100"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <Button
                onClick={submitVote}
                className="w-full"
                variant="default"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Response'}
              </Button>
            </div>
          ) : (
            <Alert className="bg-green-900/20 border-green-800">
              <AlertDescription className="text-green-400">
                Thanks! Your response has been recorded.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
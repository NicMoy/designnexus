import { useState, useEffect } from 'react';

export function useUpvote(resourceId: string, initialVotes: number = 0) {
  const [votes, setVotes] = useState(initialVotes);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const userVoted = localStorage.getItem(`voted-${resourceId}`);
    if (userVoted) {
      setHasVoted(true);
    }
  }, [resourceId]);

  const handleVote = () => {
    if (!hasVoted) {
      setVotes(prev => prev + 1);
      setHasVoted(true);
      localStorage.setItem(`voted-${resourceId}`, 'true');
    }
  };

  return { votes, hasVoted, handleVote };
}
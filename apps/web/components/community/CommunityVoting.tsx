'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import { toast } from 'react-toastify';

interface CommunitySuggestion {
  id: string;
  place_name: string;
  votes: number;
  submitter_email: string;
}

interface CommunityVotingProps {
  suggestion: CommunitySuggestion;
}

export const CommunityVoting = ({ suggestion }: CommunityVotingProps) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(suggestion.votes);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    // Check if user has voted (using localStorage for demo)
    const votedSuggestions = JSON.parse(localStorage.getItem('votedSuggestions') || '[]');
    setHasVoted(votedSuggestions.includes(suggestion.id));
  }, [suggestion.id]);

  const handleVote = async () => {
    if (hasVoted || isVoting) return;
    
    setIsVoting(true);
    try {
      const response = await fetch(`/api/community-suggestions/${suggestion.id}/vote`, {
        method: 'POST',
      });

      const result = await response.json();

      if (response.ok) {
        setHasVoted(true);
        setVoteCount(result.votes);
        
        // Store vote in localStorage
        const votedSuggestions = JSON.parse(localStorage.getItem('votedSuggestions') || '[]');
        votedSuggestions.push(suggestion.id);
        localStorage.setItem('votedSuggestions', JSON.stringify(votedSuggestions));
        
        toast.success('Thank you for voting! This helps prioritize community suggestions.');
      } else {
        if (response.status === 409) {
          setHasVoted(true);
          toast.info('You have already voted for this suggestion.');
        } else {
          throw new Error(result.error || 'Failed to vote');
        }
      }
    } catch (error) {
      toast.error('Failed to vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="community-voting flex items-center space-x-3">
      <button
        onClick={handleVote}
        disabled={hasVoted || isVoting}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
          hasVoted 
            ? 'bg-green-100 text-green-800 cursor-default' 
            : 'bg-gray-100 hover:bg-yellow-100 text-gray-700 hover:text-gray-900'
        } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <ThumbsUp className={`w-4 h-4 ${hasVoted ? 'fill-current' : ''}`} />
        <span className="font-medium">{voteCount}</span>
      </button>
      
      <span className="text-sm text-gray-600">
        {hasVoted ? 'You voted for this!' : 'Vote to prioritize'}
      </span>
    </div>
  );
};
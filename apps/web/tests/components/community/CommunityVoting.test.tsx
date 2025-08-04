import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { CommunityVoting } from '@/components/community/CommunityVoting';

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
  }
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
};
global.localStorage = localStorageMock as any;

// Mock fetch
global.fetch = vi.fn();

const mockSuggestion = {
  id: 'test-123',
  place_name: 'Amazing Cafe',
  votes: 5,
  submitter_email: 'submitter@example.com'
};

describe('CommunityVoting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('[]');
    (global.fetch as any).mockClear();
  });

  it('renders voting button with vote count', () => {
    render(<CommunityVoting suggestion={mockSuggestion} />);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Vote to prioritize')).toBeInTheDocument();
  });

  it('shows already voted state when user has voted', () => {
    localStorageMock.getItem.mockReturnValue('["test-123"]');
    
    render(<CommunityVoting suggestion={mockSuggestion} />);
    
    expect(screen.getByText('You voted for this!')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('handles successful voting', async () => {
    const mockResponse = { success: true, votes: 6 };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });
    
    render(<CommunityVoting suggestion={mockSuggestion} />);
    
    const voteButton = screen.getByRole('button');
    fireEvent.click(voteButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/community-suggestions/test-123/vote', {
        method: 'POST'
      });
    });
    
    await waitFor(() => {
      expect(screen.getByText('6')).toBeInTheDocument();
      expect(screen.getByText('You voted for this!')).toBeInTheDocument();
      expect(require('react-toastify').toast.success).toHaveBeenCalledWith(
        'Thank you for voting! This helps prioritize community suggestions.'
      );
    });
  });

  it('handles voting errors', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Voting failed' })
    });
    
    render(<CommunityVoting suggestion={mockSuggestion} />);
    
    const voteButton = screen.getByRole('button');
    fireEvent.click(voteButton);
    
    await waitFor(() => {
      expect(require('react-toastify').toast.error).toHaveBeenCalledWith(
        'Failed to vote. Please try again.'
      );
    });
  });

  it('handles already voted server response', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: () => Promise.resolve({ error: 'Already voted' })
    });
    
    render(<CommunityVoting suggestion={mockSuggestion} />);
    
    const voteButton = screen.getByRole('button');
    fireEvent.click(voteButton);
    
    await waitFor(() => {
      expect(require('react-toastify').toast.info).toHaveBeenCalledWith(
        'You have already voted for this suggestion.'
      );
    });
  });

  it('prevents double voting', async () => {
    const mockResponse = { success: true, votes: 6 };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });
    
    render(<CommunityVoting suggestion={mockSuggestion} />);
    
    const voteButton = screen.getByRole('button');
    
    // First click
    fireEvent.click(voteButton);
    
    // Second click (should be ignored)
    fireEvent.click(voteButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});
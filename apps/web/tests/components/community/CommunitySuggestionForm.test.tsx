import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { CommunitySuggestionForm } from '@/components/community/CommunitySuggestionForm';

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

// Mock fetch
global.fetch = vi.fn();

describe('CommunitySuggestionForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
  });

  it('renders all form fields correctly', () => {
    render(<CommunitySuggestionForm />);
    
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/place name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tell us about this place/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit suggestion/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<CommunitySuggestionForm />);
    
    const submitButton = screen.getByRole('button', { name: /submit suggestion/i });
    fireEvent.click(submitButton);
    
    // Form should not submit without required fields
    await waitFor(() => {
      expect(screen.getByLabelText(/your name/i)).toBeInvalid();
      expect(screen.getByLabelText(/email/i)).toBeInvalid();
      expect(screen.getByLabelText(/place name/i)).toBeInvalid();
    });
  });

  it('submits form with valid data', async () => {
    const mockResponse = {
      success: true,
      suggestion: { id: 'test-123', place_name: 'Amazing Cafe', status: 'submitted' }
    };
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });
    
    render(<CommunitySuggestionForm />);
    
    // Fill out form
    fireEvent.change(screen.getByLabelText(/your name/i), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/place name/i), {
      target: { value: 'Amazing Cafe' }
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: 'cafe' }
    });
    fireEvent.change(screen.getByLabelText(/tell us about this place/i), {
      target: { value: 'Great coffee and atmosphere, perfect for work meetings.' }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /submit suggestion/i }));
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/community-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          submitter_name: 'John Doe',
          submitter_email: 'john@example.com',
          place_name: 'Amazing Cafe',
          suggested_latitude: 12.9716,
          suggested_longitude: 77.5946,
          category: 'cafe',
          personal_notes: 'Great coffee and atmosphere, perfect for work meetings.',
          images: []
        })
      });
    });
  });

  it('handles submission errors gracefully', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Validation failed' })
    });
    
    render(<CommunitySuggestionForm />);
    
    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/place name/i), { target: { value: 'Test Place' } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'cafe' } });
    fireEvent.change(screen.getByLabelText(/tell us about this place/i), { target: { value: 'Test description' } });
    
    fireEvent.click(screen.getByRole('button', { name: /submit suggestion/i }));
    
    await waitFor(() => {
      expect(require('react-toastify').toast.error).toHaveBeenCalledWith('Validation failed');
    });
  });

  it('handles character count for description', () => {
    render(<CommunitySuggestionForm />);
    
    const textarea = screen.getByLabelText(/tell us about this place/i);
    const testText = 'This is a test description';
    
    fireEvent.change(textarea, { target: { value: testText } });
    
    expect(screen.getByText(`${testText.length}/2000 characters`)).toBeInTheDocument();
  });

  it('handles social media input fields', () => {
    render(<CommunitySuggestionForm />);
    
    const instagramInput = screen.getByPlaceholderText('Instagram handle');
    const twitterInput = screen.getByPlaceholderText('Twitter handle');
    const linkedinInput = screen.getByPlaceholderText('LinkedIn profile');
    
    fireEvent.change(instagramInput, { target: { value: '@johndoe' } });
    fireEvent.change(twitterInput, { target: { value: '@johndoe' } });
    fireEvent.change(linkedinInput, { target: { value: 'linkedin.com/in/johndoe' } });
    
    expect(instagramInput).toHaveValue('@johndoe');
    expect(twitterInput).toHaveValue('@johndoe');
    expect(linkedinInput).toHaveValue('linkedin.com/in/johndoe');
  });
});
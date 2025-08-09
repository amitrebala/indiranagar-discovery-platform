import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useKeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Search shortcut: "/" or Cmd/Ctrl+K
      if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>('[data-search-input]');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        } else {
          router.push('/places');
          toast.info('Opening places search...');
        }
      }
      
      // Navigate to map: Cmd/Ctrl+M
      if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
        e.preventDefault();
        router.push('/map');
      }
      
      // Navigate to journeys: Cmd/Ctrl+J
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault();
        router.push('/journeys');
      }
      
      // Navigate home: Cmd/Ctrl+H
      if ((e.metaKey || e.ctrlKey) && e.key === 'h') {
        e.preventDefault();
        router.push('/');
      }
      
      // Toggle dark mode: Cmd/Ctrl+D
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        const event = new CustomEvent('toggle-dark-mode');
        window.dispatchEvent(event);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [router]);
}
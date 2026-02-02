import { useEffect } from 'react';
import { useUIStore } from '@/store';
import { MenuBar } from '@/components/UI/MenuBar';
import { Transport } from '@/components/Transport/Transport';
import { Timeline } from '@/components/Timeline/Timeline';
import { PianoRoll } from '@/components/PianoRoll/PianoRoll';

function App() {
  const { theme, setTheme } = useUIStore();

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Default to dark theme
      setTheme('dark');
    }
  }, [setTheme]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-bg text-text">
      {/* Menu Bar */}
      <MenuBar />

      {/* Transport Controls */}
      <Transport />

      {/* Main Content - Timeline */}
      <div className="flex-1 overflow-hidden">
        <Timeline />
      </div>

      {/* Piano Roll Modal */}
      <PianoRoll />
    </div>
  );
}

export default App;

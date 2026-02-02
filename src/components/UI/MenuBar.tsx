import { Sun, Moon } from 'lucide-react';
import { useUIStore } from '@/store';

export function MenuBar() {
  const { theme, toggleTheme } = useUIStore();

  return (
    <div className="h-10 bg-bg-elevated border-b border-border flex items-center px-4 justify-between">
      <div className="flex items-center gap-6">
        <div className="font-logo font-bold text-lg text-accent-logo">
          XeneDAW
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <button className="hover:text-accent transition-base">File</button>
          <button className="hover:text-accent transition-base">Edit</button>
          <button className="hover:text-accent transition-base">View</button>
          <button className="hover:text-accent transition-base">Project</button>
          <button className="hover:text-accent transition-base">Help</button>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded hover:bg-bg-hover transition-base"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun size={16} />
          ) : (
            <Moon size={16} />
          )}
        </button>
      </div>
    </div>
  );
}

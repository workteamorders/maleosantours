'use client';

/**
 * PreviewToggle - switches between Table view and public-page-like Preview
 * Used on admin list pages to show how content appears on the public site
 */

import { useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';

interface PreviewToggleProps {
  tableView: React.ReactNode;
  previewView: React.ReactNode;
  defaultView?: 'table' | 'preview';
}

export default function PreviewToggle({
  tableView,
  previewView,
  defaultView = 'preview',
}: PreviewToggleProps) {
  const [view, setView] = useState<'table' | 'preview'>(defaultView);

  return (
    <div>
      {/* Toggle Buttons */}
      <div className="flex items-center gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setView('table')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            view === 'table'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <List className="w-4 h-4" />
          Tabel
        </button>
        <button
          onClick={() => setView('preview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            view === 'preview'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Preview
        </button>
      </div>

      {/* Content */}
      {view === 'table' ? tableView : previewView}
    </div>
  );
}

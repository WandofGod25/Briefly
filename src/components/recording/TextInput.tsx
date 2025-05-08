'use client';

import { useState } from 'react';

interface TextInputProps {
  onSubmit: (text: string) => void;
}

export default function TextInput({ onSubmit }: TextInputProps) {
  const [text, setText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText('');
      setIsEditing(false);
    }
  };

  return (
    <div className="w-full">
      {!isEditing ? (
        <div className="flex flex-col items-center">
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Start Writing
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your update
            </label>
            <textarea
              id="text-input"
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What have you been working on? What progress have you made? Any blockers?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!text.trim()}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${!text.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 
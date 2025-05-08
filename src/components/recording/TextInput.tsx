'use client';

import { useState, useEffect } from 'react';

interface TextInputProps {
  onSubmit: (text: string) => void;
  minLength?: number;
  maxLength?: number;
}

export default function TextInput({ 
  onSubmit, 
  minLength = 10, 
  maxLength = 5000 
}: TextInputProps) {
  const [text, setText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    // Update character count and validate on text change
    setCharCount(text.length);
    validateInput(text);
  }, [text, minLength, maxLength]);

  const validateInput = (input: string) => {
    const newErrors: string[] = [];
    
    if (input.trim().length < minLength) {
      newErrors.push(`Text must be at least ${minLength} characters long`);
    }
    
    if (input.length > maxLength) {
      newErrors.push(`Text cannot exceed ${maxLength} characters`);
    }
    
    setErrors(newErrors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate before submitting
    validateInput(text);
    
    if (text.trim() && errors.length === 0) {
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
              className={`w-full px-3 py-2 border ${
                errors.length > 0 ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              } rounded-md focus:outline-none focus:ring-2 focus:border-transparent`}
              placeholder="What have you been working on? What progress have you made? Any blockers?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
              maxLength={maxLength + 100} // Allow slightly over max to show the error
            />
            
            <div className="mt-1 flex justify-between items-center">
              <div>
                {errors.length > 0 && (
                  <ul className="text-sm text-red-600">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className={`text-sm ${
                charCount > maxLength 
                  ? 'text-red-600' 
                  : charCount < minLength 
                    ? 'text-yellow-600' 
                    : 'text-gray-500'
              }`}>
                {charCount}/{maxLength}
              </div>
            </div>
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
              disabled={!text.trim() || errors.length > 0}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                !text.trim() || errors.length > 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 
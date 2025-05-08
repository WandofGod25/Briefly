'use client';

import { useState, useEffect } from 'react';
import VoiceRecorder from '@/components/recording/VoiceRecorder';
import TextInput from '@/components/recording/TextInput';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function InputPage() {
  const [inputType, setInputType] = useState<'voice' | 'text' | null>(null);
  const [processingInput, setProcessingInput] = useState(false);
  const [inputContent, setInputContent] = useState('');
  const router = useRouter();
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    // Check if user is authenticated
    if (isLoaded && !userId) {
      router.push('/');
    }
  }, [isLoaded, userId, router]);

  const handleVoiceRecordingComplete = async (audioBlob: Blob) => {
    setProcessingInput(true);
    
    // Here you would typically send the audio to a server for processing
    // or use a client-side library for speech-to-text conversion
    
    // For now, we'll simulate processing
    setTimeout(() => {
      // Simulate receiving transcribed text
      setInputContent('This is simulated transcribed text from the voice recording.');
      setProcessingInput(false);
    }, 2000);
  };

  const handleTextSubmit = (text: string) => {
    setProcessingInput(true);
    setInputContent(text);
    setProcessingInput(false);
  };

  const handleBack = () => {
    setInputType(null);
    setInputContent('');
  };

  const handleSave = () => {
    // Here you would save the report to your backend
    // For now, we'll just redirect back to the dashboard
    router.push('/');
  };

  // If auth is still loading or user is not authenticated, show nothing
  if (!isLoaded || !userId) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Create New Report</h1>
      </div>
      
      {!inputType && !inputContent ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Choose Input Method</h2>
          <p className="text-gray-600 mb-6">
            Select how you'd like to create your report
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              onClick={() => setInputType('voice')}
              className="p-6 border rounded-lg border-gray-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
            >
              <h3 className="text-lg font-medium mb-2">Voice Input</h3>
              <p className="text-gray-500 text-sm mb-4">
                Record your update using your microphone
              </p>
              <div className="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <div 
              onClick={() => setInputType('text')}
              className="p-6 border rounded-lg border-gray-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
            >
              <h3 className="text-lg font-medium mb-2">Text Input</h3>
              <p className="text-gray-500 text-sm mb-4">
                Type your update directly
              </p>
              <div className="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      ) : inputContent ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Preview Report</h2>
          
          <div className="mb-6">
            <div className="border rounded-lg p-4 bg-gray-50 whitespace-pre-wrap">
              {inputContent}
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Save Report
            </button>
          </div>
        </div>
      ) : inputType === 'voice' ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Voice Recording</h2>
          
          {processingInput ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="mb-4">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-gray-600">Processing your recording...</p>
            </div>
          ) : (
            <VoiceRecorder onRecordingComplete={handleVoiceRecordingComplete} />
          )}
          
          <div className="mt-6 flex justify-start">
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      ) : inputType === 'text' ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Text Input</h2>
          
          <TextInput onSubmit={handleTextSubmit} />
          
          <div className="mt-6 flex justify-start">
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
} 
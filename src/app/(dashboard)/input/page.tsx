'use client';

import { useState, useEffect } from 'react';
import VoiceRecorder from '@/components/recording/VoiceRecorder';
import TextInput from '@/components/recording/TextInput';
import SmartPromptInterface from '@/components/prompts/SmartPromptInterface';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

// Fallback styles in case Tailwind isn't working properly
const styles = {
  container: {
    maxWidth: '64rem',
    margin: '0 auto',
  },
  header: {
    marginBottom: '2rem',
    textAlign: 'center' as const,
  },
  headerText: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerSubtext: {
    marginTop: '0.5rem',
    color: '#4b5563',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
  },
  cardInner: {
    padding: '2rem',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
    textAlign: 'center' as const,
  },
  cardDescription: {
    color: '#4b5563',
    marginBottom: '2rem',
    textAlign: 'center' as const,
    maxWidth: '36rem',
    margin: '0 auto 2rem auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '2rem',
  },
  gridItem: {
    padding: '1.5rem',
    border: '2px solid #e5e7eb',
    borderRadius: '0.75rem',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  gridItemHover: {
    borderColor: '#3b82f6',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  icon: {
    marginBottom: '1rem',
    width: '4rem',
    height: '4rem',
    color: '#3b82f6',
  },
  itemTitle: {
    fontSize: '1.25rem',
    fontWeight: '500',
    marginBottom: '0.5rem',
    textAlign: 'center' as const,
  },
  itemDescription: {
    color: '#6b7280',
    textAlign: 'center' as const,
    marginBottom: '1rem',
  },
  button: {
    marginTop: 'auto',
    padding: '0.5rem 1.5rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#2563eb',
  },
  previewBox: {
    border: '1px solid #e5e7eb',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    backgroundColor: '#f9fafb',
    whiteSpace: 'pre-wrap' as const,
    marginBottom: '2rem',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: '0.75rem 1.5rem',
    border: '1px solid #d1d5db',
    color: '#4b5563',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    transition: 'background-color 0.3s ease',
  },
  backButtonHover: {
    backgroundColor: '#f3f4f6',
  },
  saveButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#10b981',
    color: 'white',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  saveButtonHover: {
    backgroundColor: '#059669',
  },
  spinner: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 0',
  },
  spinnerIcon: {
    animation: 'spin 1s linear infinite',
    width: '3rem',
    height: '3rem',
    color: '#3b82f6',
    marginBottom: '1.5rem',
  },
  '@keyframes spin': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  spinnerText: {
    fontSize: '1.125rem',
    color: '#4b5563',
  }
};

export default function InputPage() {
  const [inputType, setInputType] = useState<'voice' | 'text' | null>(null);
  const [processingInput, setProcessingInput] = useState(false);
  const [inputContent, setInputContent] = useState('');
  const [reportIsValid, setReportIsValid] = useState(false);
  const router = useRouter();
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    // Check if user is authenticated
    if (isLoaded && !userId) {
      router.push('/');
    }
  }, [isLoaded, userId, router]);

  const handleVoiceRecordingComplete = async (audioBlob: Blob, transcribedText?: string) => {
    setProcessingInput(true);
    
    // If transcribedText is provided, use it directly
    if (transcribedText) {
      setInputContent(transcribedText);
      setProcessingInput(false);
      return;
    }
    
    // Fallback in case no transcription was provided
    try {
      // Create form data to send to our API
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      // Send the audio to our API for transcription
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to transcribe audio');
      }
      
      const data = await response.json();
      setInputContent(data.text);
    } catch (error) {
      console.error('Transcription error:', error);
      setInputContent('Error transcribing audio. Please try again or use text input instead.');
    } finally {
      setProcessingInput(false);
    }
  };

  const handleTextSubmit = (text: string) => {
    setProcessingInput(true);
    setInputContent(text);
    setProcessingInput(false);
  };

  const handleApplyPrompt = (promptTemplate: string) => {
    setInputContent(prev => {
      // If there's already content, append the prompt template
      if (prev.trim()) {
        return prev + '\n\n' + promptTemplate;
      }
      return promptTemplate;
    });
  };

  const handleValidation = (isValid: boolean) => {
    setReportIsValid(isValid);
  };

  const handleBack = () => {
    setInputType(null);
    setInputContent('');
  };

  const handleSave = () => {
    // Here you would save the report to your backend
    // For now, we'll just redirect back to the dashboard
    router.push('/dashboard');
  };

  // If auth is still loading or user is not authenticated, show loading spinner
  if (!isLoaded || !userId) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh'
      }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          borderRadius: '50%',
          borderTop: '2px solid #4f46e5',
          borderBottom: '2px solid #4f46e5',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto" style={styles.container}>
      <div className="mb-8 text-center" style={styles.header}>
        <h1 className="text-3xl font-bold text-gray-800" style={styles.headerText}>Create New Report</h1>
        <p className="mt-2 text-gray-600" style={styles.headerSubtext}>Record your work progress using voice or text input</p>
      </div>
      
      {!inputType && !inputContent ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden" style={styles.card}>
          <div className="p-8" style={styles.cardInner}>
            <h2 className="text-2xl font-semibold mb-4 text-center" style={styles.cardTitle}>Choose Input Method</h2>
            <p className="text-gray-600 mb-8 text-center max-w-xl mx-auto" style={styles.cardDescription}>
              Select how you'd like to create your report
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{
              ...styles.grid,
              gridTemplateColumns: window.innerWidth >= 768 ? 'repeat(2, 1fr)' : '1fr'
            }}>
              <div 
                onClick={() => setInputType('voice')}
                className="p-6 border-2 rounded-xl border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center"
                style={styles.gridItem}
                onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.gridItemHover)}
                onMouseOut={(e) => Object.assign(e.currentTarget.style, styles.gridItem)}
              >
                <div className="flex justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" style={styles.icon} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2 text-center" style={styles.itemTitle}>Voice Input</h3>
                <p className="text-gray-500 text-center mb-4" style={styles.itemDescription}>
                  Record your update using your microphone
                </p>
                <button 
                  className="mt-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  style={styles.button}
                  onMouseOver={(e) => Object.assign(e.currentTarget.style, {...styles.button, ...styles.buttonHover})}
                  onMouseOut={(e) => Object.assign(e.currentTarget.style, styles.button)}
                >
                  Start Recording
                </button>
              </div>
              
              <div 
                onClick={() => setInputType('text')}
                className="p-6 border-2 rounded-xl border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center"
                style={styles.gridItem}
                onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.gridItemHover)}
                onMouseOut={(e) => Object.assign(e.currentTarget.style, styles.gridItem)}
              >
                <div className="flex justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" style={styles.icon} viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2 text-center" style={styles.itemTitle}>Text Input</h3>
                <p className="text-gray-500 text-center mb-4" style={styles.itemDescription}>
                  Type your update directly
                </p>
                <button 
                  className="mt-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  style={styles.button}
                  onMouseOver={(e) => Object.assign(e.currentTarget.style, {...styles.button, ...styles.buttonHover})}
                  onMouseOut={(e) => Object.assign(e.currentTarget.style, styles.button)}
                >
                  Start Writing
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : inputContent ? (
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-medium mb-4">Your Report</h3>
              <div style={styles.previewBox} className="min-h-[300px]">
                {inputContent}
              </div>
              
              <div style={styles.buttonGroup}>
                <button
                  onClick={handleBack}
                  style={styles.backButton}
                  className="hover:bg-gray-100"
                >
                  Back
                </button>
                <button
                  onClick={handleSave}
                  style={styles.saveButton}
                  className={`hover:bg-green-600 ${!reportIsValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!reportIsValid}
                  title={!reportIsValid ? "Please complete all required sections" : "Save your report"}
                >
                  Save Report
                </button>
              </div>
              
              {!reportIsValid && (
                <div className="mt-4 p-3 bg-amber-50 text-amber-700 rounded-md text-sm">
                  Please complete all required sections before saving your report.
                </div>
              )}
            </div>
            
            <div>
              <SmartPromptInterface 
                onApplyPrompt={handleApplyPrompt} 
                existingContent={inputContent}
                userRole="developer"
                onValidate={handleValidation}
              />
            </div>
          </div>
        </div>
      ) : inputType === 'voice' ? (
        <div className="bg-white rounded-xl shadow-md p-8" style={styles.card}>
          <h2 className="text-2xl font-semibold mb-6 text-center" style={styles.cardTitle}>Voice Recording</h2>
          
          {processingInput ? (
            <div className="flex flex-col items-center justify-center py-12" style={styles.spinner}>
              <div className="mb-6">
                <svg style={styles.spinnerIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-lg text-gray-600" style={styles.spinnerText}>Processing your recording...</p>
            </div>
          ) : (
            <div className="flex justify-center mb-8" style={{display: 'flex', justifyContent: 'center', marginBottom: '2rem'}}>
              <div className="w-full max-w-md" style={{width: '100%', maxWidth: '28rem'}}>
                <VoiceRecorder onRecordingComplete={handleVoiceRecordingComplete} />
              </div>
            </div>
          )}
          
          <div className="flex justify-center mt-8" style={{display: 'flex', justifyContent: 'center', marginTop: '2rem'}}>
            <button
              onClick={handleBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              style={styles.backButton}
              onMouseOver={(e) => Object.assign(e.currentTarget.style, {...styles.backButton, ...styles.backButtonHover})}
              onMouseOut={(e) => Object.assign(e.currentTarget.style, styles.backButton)}
            >
              Back
            </button>
          </div>
        </div>
      ) : inputType === 'text' ? (
        <div className="bg-white rounded-xl shadow-md p-8" style={styles.card}>
          <h2 className="text-2xl font-semibold mb-6 text-center" style={styles.cardTitle}>Text Input</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="col-span-1 md:col-span-1">
              <SmartPromptInterface onApplyPrompt={handleApplyPrompt} />
            </div>
            <div className="col-span-1 md:col-span-2">
              <TextInput onSubmit={handleTextSubmit} />
            </div>
          </div>
          
          <div className="flex justify-center mt-8" style={{display: 'flex', justifyContent: 'center', marginTop: '2rem'}}>
            <button
              onClick={handleBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              style={styles.backButton}
              onMouseOver={(e) => Object.assign(e.currentTarget.style, {...styles.backButton, ...styles.backButtonHover})}
              onMouseOut={(e) => Object.assign(e.currentTarget.style, styles.backButton)}
            >
              Back
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
} 
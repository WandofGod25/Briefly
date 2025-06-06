'use client';

import { useState, useEffect } from 'react';
import VoiceRecorder from '@/components/recording/VoiceRecorder';
import TextInput from '@/components/recording/TextInput';
import SmartPromptInterface from '@/components/prompts/SmartPromptInterface';
import ExportModal from '@/components/export/ExportModal';
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
  const [generatingReport, setGeneratingReport] = useState(false);
  const [structuredReport, setStructuredReport] = useState('');
  const [reportTasks, setReportTasks] = useState<string[]>([]);
  const [reportMode, setReportMode] = useState<'draft' | 'structured' | 'editing' | 'finalizing'>('draft');
  const [editableReport, setEditableReport] = useState('');
  const [savingReport, setSavingReport] = useState(false);
  const [reportTitle, setReportTitle] = useState(`Weekly Report - ${new Date().toLocaleDateString()}`);
  const [showExportModal, setShowExportModal] = useState(false);
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
    if (reportMode === 'structured' || reportMode === 'editing') {
      // Go back to draft mode
      setReportMode('draft');
    } else {
      // Go back to input selection
      setInputType(null);
      setInputContent('');
      setStructuredReport('');
      setReportTasks([]);
      setReportMode('draft');
    }
  };

  const handleSave = async () => {
    if (reportMode === 'draft') {
      // Just save the draft - for now just redirect
      router.push('/dashboard');
      return;
    }
    
    // If we're in structured or editing mode, we'll finalize the report
    try {
      setSavingReport(true);
      
      const response = await fetch('/api/finalize-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          draftContent: inputContent,
          structuredContent: structuredReport,
          tasks: reportTasks,
          title: reportTitle
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to finalize report');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Show a finalization success message
        setReportMode('finalizing');
        
        // After a brief delay, redirect to the dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        throw new Error(data.error || 'Failed to finalize report');
      }
    } catch (error) {
      console.error('Report finalization error:', error);
      alert('Failed to finalize report. Please try again.');
    } finally {
      setSavingReport(false);
    }
  };

  const handleGenerateStructuredReport = async () => {
    setGeneratingReport(true);
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: inputContent,
          userRole: 'developer', // This could be made dynamic based on user's role
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const data = await response.json();
      
      if (data.success) {
        setStructuredReport(data.structuredReport);
        setReportTasks(data.tasks || []);
        setReportMode('structured');
        // Initialize editable report with structured report
        setEditableReport(data.structuredReport);
      } else {
        throw new Error(data.error || 'Failed to generate report');
      }
    } catch (error) {
      console.error('Report generation error:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleEditReport = () => {
    setReportMode('editing');
  };

  const handleReportChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableReport(e.target.value);
  };

  const handleSaveEdits = () => {
    setStructuredReport(editableReport);
    setReportMode('structured');
  };

  const handleReportTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReportTitle(e.target.value);
  };

  const handleOpenExportModal = () => {
    setShowExportModal(true);
  };

  const handleCloseExportModal = () => {
    setShowExportModal(false);
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

  const renderReportSection = () => {
    if (reportMode === 'draft') {
      return (
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium">Your Report Draft</h3>
                <button
                  onClick={handleGenerateStructuredReport}
                  disabled={!reportIsValid || generatingReport}
                  className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors ${!reportIsValid || generatingReport ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {generatingReport ? 'Generating...' : 'Generate Structured Report'}
                </button>
              </div>
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
                  Save Draft
                </button>
              </div>
              
              {!reportIsValid && (
                <div className="mt-4 p-3 bg-amber-50 text-amber-700 rounded-md text-sm">
                  Please complete all required sections before saving or generating your report.
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
      );
    } else if (reportMode === 'structured') {
      return (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium">Structured Report</h3>
            <div className="space-x-2">
              <button
                onClick={handleEditReport}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Report
              </button>
              <button
                onClick={handleOpenExportModal}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Export
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="reportTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Report Title
            </label>
            <input
              type="text"
              id="reportTitle"
              value={reportTitle}
              onChange={handleReportTitleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="prose max-w-none">
              {structuredReport.split('\n').map((line, index) => {
                if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-xl font-semibold mt-6 mb-3 text-gray-800">{line.replace('## ', '')}</h2>;
                } else if (line.startsWith('# ')) {
                  return <h1 key={index} className="text-2xl font-bold mt-6 mb-4 text-gray-900">{line.replace('# ', '')}</h1>;
                } else if (line.trim() === '') {
                  return <br key={index} />;
                } else {
                  return <p key={index} className="my-2 text-gray-700">{line}</p>;
                }
              })}
            </div>
          </div>

          {reportTasks.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-medium mb-4 text-gray-800">Extracted Tasks</h3>
              <ul className="space-y-2">
                {reportTasks.map((task, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full mr-2 flex-shrink-0 text-center">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Back to Draft
            </button>
            <div className="flex space-x-3">
              <button
                onClick={handleOpenExportModal}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export
              </button>
              <button
                onClick={handleSave}
                disabled={savingReport}
                className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors ${savingReport ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {savingReport ? 'Saving...' : 'Finalize Report'}
              </button>
            </div>
          </div>
        </div>
      );
    } else if (reportMode === 'editing') {
      return (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium">Edit Report</h3>
          </div>

          <textarea
            value={editableReport}
            onChange={handleReportChange}
            className="w-full min-h-[400px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4 font-mono text-sm"
          />

          <div className="flex justify-between">
            <button
              onClick={() => setReportMode('structured')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdits}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Save Edits
            </button>
          </div>
        </div>
      );
    } else if (reportMode === 'finalizing') {
      return (
        <div className="mt-8 text-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Report Finalized!</h2>
            <p className="text-gray-600 mb-4">
              Your report has been successfully finalized and saved.
            </p>
            <p className="text-sm text-gray-500">
              You will be redirected to the dashboard shortly...
            </p>
          </div>
        </div>
      );
    }
  };

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
        renderReportSection()
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
      
      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={handleCloseExportModal}
        reportContent={structuredReport}
        reportTitle={reportTitle}
        reportTasks={reportTasks}
      />
    </div>
  );
} 
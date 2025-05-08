'use client';

import { useState } from 'react';
import { 
  convertToMarkdown, 
  convertToEmailSnippet, 
  convertToSlackMessage,
  downloadAsFile
} from '@/lib/utils/export';

interface ExportOptionsProps {
  reportContent: string;
  reportTitle: string;
  reportTasks: string[];
  onClose?: () => void;
}

export default function ExportOptions({ 
  reportContent, 
  reportTitle,
  reportTasks,
  onClose 
}: ExportOptionsProps) {
  const [activeTab, setActiveTab] = useState<'markdown' | 'email' | 'slack'>('markdown');
  const [copied, setCopied] = useState(false);
  
  // Generate the appropriate content based on the active tab
  const getExportContent = () => {
    switch (activeTab) {
      case 'markdown':
        return convertToMarkdown(reportContent, reportTitle, reportTasks);
      case 'email':
        return convertToEmailSnippet(reportContent, reportTitle, reportTasks);
      case 'slack':
        return convertToSlackMessage(reportContent, reportTitle, reportTasks);
      default:
        return convertToMarkdown(reportContent, reportTitle, reportTasks);
    }
  };
  
  // Copy content to clipboard
  const handleCopy = async () => {
    const content = getExportContent();
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Download content as a file
  const handleDownload = () => {
    const content = getExportContent();
    let filename: string;
    let mimeType: string;
    
    switch (activeTab) {
      case 'markdown':
        filename = `${reportTitle.replace(/\s+/g, '-').toLowerCase()}.md`;
        mimeType = 'text/markdown';
        break;
      case 'email':
        filename = `${reportTitle.replace(/\s+/g, '-').toLowerCase()}-email.txt`;
        mimeType = 'text/plain';
        break;
      case 'slack':
        filename = `${reportTitle.replace(/\s+/g, '-').toLowerCase()}-slack.txt`;
        mimeType = 'text/plain';
        break;
      default:
        filename = `${reportTitle.replace(/\s+/g, '-').toLowerCase()}.txt`;
        mimeType = 'text/plain';
    }
    
    downloadAsFile(content, filename, mimeType);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">Export Options</h3>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Format tabs */}
      <div className="border-b border-gray-200 mb-4">
        <nav className="flex -mb-px space-x-8">
          <button
            onClick={() => setActiveTab('markdown')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'markdown'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Markdown
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'email'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setActiveTab('slack')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'slack'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Slack
          </button>
        </nav>
      </div>
      
      {/* Preview */}
      <div className="mb-4">
        <label htmlFor="export-preview" className="block text-sm font-medium text-gray-700 mb-1">
          Preview
        </label>
        <textarea
          id="export-preview"
          className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm bg-gray-50"
          readOnly
          value={getExportContent()}
        />
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-between">
        <div>
          {copied && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Copied!
            </span>
          )}
        </div>
        <div className="space-x-4">
          <button
            onClick={handleCopy}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Copy to Clipboard
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
} 
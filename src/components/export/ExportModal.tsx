'use client';

import { useEffect, useRef } from 'react';
import ExportOptions from './ExportOptions';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportContent: string;
  reportTitle: string;
  reportTasks: string[];
}

export default function ExportModal({
  isOpen,
  onClose,
  reportContent,
  reportTitle,
  reportTasks
}: ExportModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white rounded-xl shadow-xl p-1 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <ExportOptions 
          reportContent={reportContent}
          reportTitle={reportTitle}
          reportTasks={reportTasks}
          onClose={onClose}
        />
      </div>
    </div>
  );
} 
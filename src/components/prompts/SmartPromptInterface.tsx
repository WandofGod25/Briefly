'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  SparklesIcon, 
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface PromptSection {
  id: string;
  title: string;
  description: string;
  examples: string[];
  placeholder: string;
  contextualExamples?: Record<string, string[]>;
  isCollapsed?: boolean;
  minWords?: number;
  recommendedWords?: number;
}

interface SectionValidation {
  isValid: boolean;
  message?: string;
  wordCount: number;
}

interface SmartPromptInterfaceProps {
  onApplyPrompt: (prompt: string) => void;
  existingContent?: string;
  userRole?: string;
  projectContext?: string;
  onValidate?: (isValid: boolean, validationResults: Record<string, SectionValidation>) => void;
}

export default function SmartPromptInterface({ 
  onApplyPrompt, 
  existingContent = '',
  userRole = 'developer',
  projectContext = 'software',
  onValidate
}: SmartPromptInterfaceProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [contextualPrompts, setContextualPrompts] = useState<PromptSection[]>([]);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [validationResults, setValidationResults] = useState<Record<string, SectionValidation>>({});
  
  // Refs for measuring content heights for smooth animations
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Default prompt sections for weekly reports with validation requirements
  const basePromptSections: PromptSection[] = [
    {
      id: 'accomplishments',
      title: 'Accomplishments',
      description: 'What tasks, projects, or milestones did you complete this week?',
      examples: [
        'Completed the authentication flow implementation',
        'Fixed critical bug in the dashboard that was causing slow loading',
        'Deployed the new feature to production',
      ],
      placeholder: 'What did you accomplish this week?',
      minWords: 15,
      recommendedWords: 50,
      contextualExamples: {
        developer: [
          'Completed the authentication flow implementation',
          'Fixed critical bug in the dashboard that was causing slow loading',
          'Deployed the new feature to production',
        ],
        designer: [
          'Finished UI mockups for the new onboarding flow',
          'Created design system components for the dashboard',
          'Delivered user research findings presentation',
        ],
        manager: [
          'Finalized Q3 roadmap with stakeholders',
          'Completed all scheduled 1:1 meetings with team members',
          'Successfully hired two new developers for the frontend team',
        ],
        marketing: [
          'Launched new product email campaign with 35% open rate',
          'Completed SEO optimization for the landing page',
          'Published three new blog posts on industry trends',
        ]
      }
    },
    {
      id: 'progress',
      title: 'Progress',
      description: 'What ongoing work have you made progress on but hasn\'t been completed?',
      examples: [
        'Made 75% progress on the notification system',
        'Started work on the new API integration',
        'Continued refactoring the legacy codebase',
      ],
      placeholder: 'What are you in the middle of working on?',
      minWords: 15,
      recommendedWords: 50,
      contextualExamples: {
        developer: [
          'Made 75% progress on the notification system',
          'Started work on the new API integration',
          'Continued refactoring the legacy codebase',
        ],
        designer: [
          'Working on UI animations for the mobile app',
          'Iterating on user feedback for the checkout flow',
          'Creating illustrations for the empty states',
        ],
        manager: [
          'Implementing new team processes for code review',
          'Working with Finance on Q4 budget planning',
          'Developing performance improvement plans for team growth',
        ],
        marketing: [
          'Building the content calendar for next quarter',
          'Working on analytics dashboard for campaign tracking',
          'Developing partnerships with industry influencers',
        ]
      }
    },
    {
      id: 'challenges',
      title: 'Challenges & Blockers',
      description: 'What challenges or blockers are you facing?',
      examples: [
        'Waiting on API credentials from the third-party service',
        'Having trouble with the performance of the new query',
        'Need design clarification for the profile page',
      ],
      placeholder: 'What\'s blocking your progress or causing difficulties?',
      minWords: 10,
      recommendedWords: 40,
      contextualExamples: {
        developer: [
          'Waiting on API credentials from the third-party service',
          'Having trouble with the performance of the new query',
          'Need design clarification for the profile page',
        ],
        designer: [
          'Waiting for content strategy for the new landing page',
          'Need alignment on accessibility requirements',
          'Having technical feasibility questions about animations',
        ],
        manager: [
          'Team capacity is limited due to unexpected PTO',
          'Waiting on budget approval for new tools',
          'Integration team is behind schedule affecting our timeline',
        ],
        marketing: [
          'Delayed content approval from legal team',
          'Analytics tracking issues affecting campaign measurement',
          'Limited budget for paid advertising channels',
        ]
      }
    },
    {
      id: 'next',
      title: 'Next Week',
      description: 'What are your priorities for next week?',
      examples: [
        'Complete the data visualization component',
        'Review pending pull requests',
        'Start planning for the Q3 roadmap',
      ],
      placeholder: 'What will you focus on next week?',
      minWords: 15,
      recommendedWords: 50,
      contextualExamples: {
        developer: [
          'Complete the data visualization component',
          'Review pending pull requests',
          'Start planning for the Q3 roadmap',
        ],
        designer: [
          'Finalize the design system component library',
          'Conduct usability testing for new features',
          'Create assets for the marketing campaign',
        ],
        manager: [
          'Conduct performance reviews for team members',
          'Finalize resource allocation for upcoming sprint',
          'Present project status to executive stakeholders',
        ],
        marketing: [
          'Launch A/B testing for new landing page variants',
          'Analyze results from the previous campaign',
          'Prepare content briefs for upcoming product release',
        ]
      }
    },
    {
      id: 'help',
      title: 'Need Help With',
      description: 'What areas do you need assistance, feedback, or resources for?',
      examples: [
        'Need code review on the authentication PR',
        'Would like feedback on the new UI design',
        'Need help with the Docker setup',
      ],
      placeholder: 'What do you need help with?',
      minWords: 5,
      recommendedWords: 30,
      contextualExamples: {
        developer: [
          'Need code review on the authentication PR',
          'Would like feedback on the new UI design',
          'Need help with the Docker setup',
        ],
        designer: [
          'Need feedback on the information architecture',
          'Looking for resources on motion design patterns',
          'Need help prioritizing design debt items',
        ],
        manager: [
          'Need advice on handling team conflict',
          'Looking for better estimation techniques',
          'Need help with cross-team dependencies',
        ],
        marketing: [
          'Need technical support for implementing UTM tracking',
          'Would like feedback on the messaging strategy',
          'Need additional resources for content creation',
        ]
      }
    }
  ];

  // Effect to adjust prompts based on context
  useEffect(() => {
    const adaptedPrompts = basePromptSections.map(section => {
      const adaptedSection = { ...section };
      
      // Use role-specific examples if available
      if (section.contextualExamples && section.contextualExamples[userRole]) {
        adaptedSection.examples = section.contextualExamples[userRole];
      }
      
      return adaptedSection;
    });
    
    setContextualPrompts(adaptedPrompts);
    
    // Initialize collapsed state for each section
    const initialCollapsedState: Record<string, boolean> = {};
    adaptedPrompts.forEach(section => {
      initialCollapsedState[section.id] = section.isCollapsed !== false;
    });
    setCollapsedSections(initialCollapsedState);
  }, [userRole, projectContext]);

  // Validate the content for each section
  useEffect(() => {
    if (!existingContent) {
      setValidationResults({});
      return;
    }
    
    // Parse content and analyze each section
    const results: Record<string, SectionValidation> = {};
    const sections = parseSections(existingContent);
    
    let isAllValid = true;
    
    contextualPrompts.forEach(promptSection => {
      const sectionContent = sections[promptSection.title.toLowerCase()] || '';
      const wordCount = countWords(sectionContent);
      const minWords = promptSection.minWords || 0;
      const recommendedWords = promptSection.recommendedWords || 0;
      
      let isValid = true;
      let message = '';
      
      if (wordCount < minWords) {
        isValid = false;
        isAllValid = false;
        message = `Too brief. Add at least ${minWords - wordCount} more words.`;
      } else if (wordCount < recommendedWords) {
        message = `Good start, but consider adding more detail (${recommendedWords - wordCount} more words recommended).`;
      } else {
        message = 'Great level of detail!';
      }
      
      results[promptSection.id] = {
        isValid,
        message,
        wordCount
      };
    });
    
    setValidationResults(results);
    
    // Call the validation callback if provided
    if (onValidate) {
      onValidate(isAllValid, results);
    }
  }, [existingContent, contextualPrompts, onValidate]);
  
  // Helper function to parse sections from the content
  const parseSections = (content: string): Record<string, string> => {
    const result: Record<string, string> = {};
    const lines = content.split('\n');
    
    let currentSection = '';
    let sectionContent: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('##') || line.startsWith('# ')) {
        // If we were already in a section, save its content
        if (currentSection) {
          result[currentSection.toLowerCase()] = sectionContent.join('\n').trim();
          sectionContent = [];
        }
        
        // Start a new section
        currentSection = line.replace(/^#+\s*/, '').trim();
      } else if (currentSection) {
        sectionContent.push(line);
      }
    }
    
    // Save the last section if there was one
    if (currentSection) {
      result[currentSection.toLowerCase()] = sectionContent.join('\n').trim();
    }
    
    return result;
  };
  
  // Helper function to count words in text
  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  // Analyze existing content to suggest which sections need attention
  useEffect(() => {
    if (!existingContent) return;
    
    // Simple analysis to detect which sections might be missing or need more detail
    const content = existingContent.toLowerCase();
    
    // Auto-expand a section if it's not mentioned in the content
    if (!expandedSection) {
      if (!content.includes('accomplish') && !content.includes('complete') && !content.includes('finish')) {
        setExpandedSection('accomplishments');
        setCollapsedSections(prev => ({ ...prev, accomplishments: false }));
      } else if (!content.includes('progress') && !content.includes('working on') && !content.includes('ongoing')) {
        setExpandedSection('progress');
        setCollapsedSections(prev => ({ ...prev, progress: false }));
      } else if (!content.includes('challeng') && !content.includes('block') && !content.includes('issue')) {
        setExpandedSection('challenges');
        setCollapsedSections(prev => ({ ...prev, challenges: false }));
      } else if (!content.includes('next week') && !content.includes('plan') && !content.includes('upcoming')) {
        setExpandedSection('next');
        setCollapsedSections(prev => ({ ...prev, next: false }));
      } else if (!content.includes('help') && !content.includes('assist') && !content.includes('need')) {
        setExpandedSection('help');
        setCollapsedSections(prev => ({ ...prev, help: false }));
      }
    }
  }, [existingContent, expandedSection]);

  const toggleSection = (sectionId: string) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionId);
    }
    
    // Toggle collapsed state
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleApplyPrompt = (sectionId: string) => {
    const section = contextualPrompts.find(s => s.id === sectionId);
    if (section) {
      // Create a prompt template based on the section
      const promptTemplate = `## ${section.title}\n${section.description}\n\n`;
      onApplyPrompt(promptTemplate);
      
      // Auto-collapse section after applying
      setCollapsedSections(prev => ({
        ...prev,
        [sectionId]: true
      }));
      
      if (expandedSection === sectionId) {
        setExpandedSection(null);
      }
    }
  };

  const handleApplyFullTemplate = () => {
    // Create a full report template with all sections
    const fullTemplate = contextualPrompts.map(section => 
      `## ${section.title}\n${section.placeholder}\n\n`
    ).join('');
    
    onApplyPrompt(fullTemplate);
    
    // Collapse all sections
    const allCollapsed: Record<string, boolean> = {};
    contextualPrompts.forEach(section => {
      allCollapsed[section.id] = true;
    });
    setCollapsedSections(allCollapsed);
    setExpandedSection(null);
  };

  // Check if we should suggest prompt additions based on content analysis
  const getSectionSuggestion = (sectionId: string) => {
    if (!existingContent) return null;
    
    const content = existingContent.toLowerCase();
    const section = contextualPrompts.find(s => s.id === sectionId);
    if (!section) return null;
    
    const keywordsMap: Record<string, string[]> = {
      'accomplishments': ['accomplish', 'complete', 'finish', 'deliver', 'ship'],
      'progress': ['progress', 'working on', 'ongoing', 'continue', 'started'],
      'challenges': ['challeng', 'block', 'issue', 'problem', 'difficult'],
      'next': ['next week', 'plan', 'upcoming', 'focus', 'priority'],
      'help': ['help', 'assist', 'need', 'support', 'question']
    };
    
    const keywords = keywordsMap[sectionId] || [];
    const hasMention = keywords.some(keyword => content.includes(keyword));
    
    if (!hasMention) {
      return {
        message: `Your report might be missing information about ${section.title.toLowerCase()}`,
        priority: 'high'
      };
    }
    
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 bg-indigo-50 border-b border-indigo-100">
        <h3 className="text-lg font-medium text-indigo-800">Smart Prompt Guidance</h3>
        <p className="text-sm text-indigo-600">
          Use these contextual prompts to structure your weekly report
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {contextualPrompts.map((section) => {
          const suggestion = getSectionSuggestion(section.id);
          const isCollapsed = collapsedSections[section.id];
          const validation = validationResults[section.id];
          
          return (
            <div 
              key={section.id} 
              className={`hover:bg-gray-50 transition-colors duration-200 
                ${suggestion ? 'border-l-4 border-amber-400' : ''} 
                ${validation && !validation.isValid ? 'border-l-4 border-red-400' : ''}
                ${validation && validation.isValid && validation.wordCount >= (section.recommendedWords || 0) ? 'border-l-4 border-green-400' : ''}`
              }
            >
              <button
                className="w-full px-4 py-3 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleSection(section.id)}
                aria-expanded={!isCollapsed}
                aria-controls={`content-${section.id}`}
              >
                <span className="font-medium text-gray-700 flex items-center">
                  {section.title}
                  {suggestion && (
                    <span className="ml-2 flex items-center text-amber-500">
                      <SparklesIcon className="h-4 w-4 mr-1" />
                      <span className="text-xs">Suggested</span>
                    </span>
                  )}
                  {validation && (
                    <span className={`ml-2 flex items-center ${
                      !validation.isValid 
                        ? 'text-red-500' 
                        : validation.wordCount >= (section.recommendedWords || 0)
                          ? 'text-green-500'
                          : 'text-amber-500'
                    }`}>
                      {!validation.isValid && <ExclamationCircleIcon className="h-4 w-4 mr-1" />}
                      {validation && validation.isValid && validation.wordCount >= (section.recommendedWords || 0) && 
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                      }
                      <span className="text-xs">{validation.wordCount} words</span>
                    </span>
                  )}
                </span>
                {isCollapsed ? (
                  <ChevronDownIcon className="h-5 w-5 text-gray-400 transition-transform duration-200" />
                ) : (
                  <ChevronUpIcon className="h-5 w-5 text-gray-400 transition-transform duration-200" />
                )}
              </button>

              {suggestion && isCollapsed && (
                <div className="px-4 py-2 text-xs text-amber-700 bg-amber-50">
                  {suggestion.message}
                </div>
              )}
              
              {validation && isCollapsed && (
                <div className={`px-4 py-2 text-xs ${
                  !validation.isValid 
                    ? 'text-red-700 bg-red-50' 
                    : validation.wordCount >= (section.recommendedWords || 0)
                      ? 'text-green-700 bg-green-50'
                      : 'text-amber-700 bg-amber-50'
                }`}>
                  {validation.message}
                </div>
              )}

              <div
                id={`content-${section.id}`}
                ref={(el) => {
                  contentRefs.current[section.id] = el;
                  return undefined;
                }}
                className={`px-4 overflow-hidden transition-all duration-300 ease-in-out ${
                  isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100 pb-3'
                }`}
              >
                <p className="text-sm text-gray-600 mb-2 pt-3">{section.description}</p>
                
                <div className="bg-gray-50 p-3 rounded-md mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Examples for {userRole}s</h4>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                    {section.examples.map((example, index) => (
                      <li key={index}>{example}</li>
                    ))}
                  </ul>
                </div>
                
                {validation && (
                  <div className={`mb-3 p-2 rounded-md text-xs ${
                    !validation.isValid 
                      ? 'bg-red-50 text-red-700' 
                      : validation.wordCount >= (section.recommendedWords || 0)
                        ? 'bg-green-50 text-green-700'
                        : 'bg-amber-50 text-amber-700'
                  }`}>
                    <p className="flex items-center">
                      {!validation.isValid && <ExclamationCircleIcon className="h-4 w-4 mr-1" />}
                      {validation.isValid && validation.wordCount >= (section.recommendedWords || 0) && 
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                      }
                      {validation.message}
                    </p>
                    <p className="mt-1">
                      {section.minWords && <span>Min: {section.minWords} words. </span>}
                      {section.recommendedWords && <span>Recommended: {section.recommendedWords} words. </span>}
                      <span>Current: {validation.wordCount} words.</span>
                    </p>
                  </div>
                )}
                
                <button
                  onClick={() => handleApplyPrompt(section.id)}
                  className="w-full px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
                >
                  Add to Report
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <button
          onClick={handleApplyFullTemplate}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center"
        >
          Apply Full Report Template
        </button>
      </div>
    </div>
  );
} 
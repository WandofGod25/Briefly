/**
 * Export utilities for converting structured report content into various formats
 */

/**
 * Convert structured report content to Markdown format
 */
export function convertToMarkdown(
  structuredContent: string, 
  title: string = 'Weekly Report',
  tasks: string[] = []
): string {
  // Add title as h1
  let markdown = `# ${title}\n\n`;
  
  // Process the structured content
  const lines = structuredContent.split('\n');
  
  for (const line of lines) {
    // Handle headings - already in markdown format
    if (line.startsWith('# ') || line.startsWith('## ') || line.startsWith('### ')) {
      markdown += `${line}\n\n`;
    } 
    // Handle empty lines
    else if (line.trim() === '') {
      markdown += '\n';
    } 
    // Handle regular content
    else {
      markdown += `${line}\n\n`;
    }
  }
  
  // Add tasks section if there are tasks
  if (tasks.length > 0) {
    markdown += `## Extracted Tasks\n\n`;
    tasks.forEach((task, index) => {
      markdown += `- [ ] ${task}\n`;
    });
    markdown += '\n';
  }
  
  return markdown;
}

/**
 * Convert structured report content to email format
 */
export function convertToEmailSnippet(
  structuredContent: string, 
  title: string = 'Weekly Report',
  tasks: string[] = []
): string {
  // Create email header
  let email = `Subject: ${title}\n\n`;
  
  // Process the structured content
  const lines = structuredContent.split('\n');
  let currentSection = '';
  
  for (const line of lines) {
    // Handle headings - convert to bold text for email
    if (line.startsWith('# ')) {
      email += `**${line.replace('# ', '')}**\n\n`;
    } 
    else if (line.startsWith('## ')) {
      currentSection = line.replace('## ', '');
      email += `**${currentSection}**\n\n`;
    } 
    // Handle empty lines
    else if (line.trim() === '') {
      email += '\n';
    } 
    // Handle regular content
    else {
      email += `${line}\n\n`;
    }
  }
  
  // Add tasks section if there are tasks
  if (tasks.length > 0) {
    email += `**Upcoming Tasks:**\n\n`;
    tasks.forEach((task, index) => {
      email += `- ${task}\n`;
    });
    email += '\n';
  }
  
  // Add a standard signature
  email += '\nBest regards,\n[Your Name]';
  
  return email;
}

/**
 * Convert structured report content to Slack message format
 */
export function convertToSlackMessage(
  structuredContent: string, 
  title: string = 'Weekly Report',
  tasks: string[] = []
): string {
  // Create Slack message
  let slackMessage = `:memo: *${title}*\n\n`;
  
  // Process the structured content
  const lines = structuredContent.split('\n');
  let currentSection = '';
  
  for (const line of lines) {
    // Handle headings - convert to bold text for Slack
    if (line.startsWith('# ')) {
      slackMessage += `*${line.replace('# ', '')}*\n\n`;
    } 
    else if (line.startsWith('## ')) {
      currentSection = line.replace('## ', '');
      slackMessage += `*${currentSection}*\n\n`;
    } 
    // Handle empty lines
    else if (line.trim() === '') {
      slackMessage += '\n';
    } 
    // Handle regular content
    else {
      slackMessage += `${line}\n\n`;
    }
  }
  
  // Add tasks section if there are tasks
  if (tasks.length > 0) {
    slackMessage += `*Upcoming Tasks:*\n\n`;
    tasks.forEach((task, index) => {
      slackMessage += `:white_small_square: ${task}\n`;
    });
    slackMessage += '\n';
  }
  
  return slackMessage;
}

/**
 * Download content as a file
 */
export function downloadAsFile(content: string, filename: string, mimeType: string): void {
  // Create a blob with the content
  const blob = new Blob([content], { type: mimeType });
  
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary anchor element
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Append the link to the document, click it, and remove it
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
} 
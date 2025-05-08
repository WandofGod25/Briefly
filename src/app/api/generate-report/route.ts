import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  // Verify authentication
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    // Parse request body
    const body = await request.json();
    const { content, userRole = 'developer' } = body;
    
    if (!content) {
      return NextResponse.json(
        { error: 'No content provided' },
        { status: 400 }
      );
    }
    
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Create the prompt for GPT-4
    const prompt = createPrompt(content, userRole);
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional report writer assistant specializing in creating well-structured weekly progress reports for work. Your task is to organize input content into clearly defined sections, improve clarity, fix grammar, and ensure professional tone while preserving all the original information and meaning."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Extract and format the response
    const structuredReport = completion.choices[0].message.content;
    
    // Extract potential tasks
    const tasks = await extractTasks(content);
    
    return NextResponse.json({
      structuredReport,
      tasks,
      success: true
    });
  } catch (error: any) {
    console.error('Report generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate report' },
      { status: 500 }
    );
  }
}

// Helper function to create a prompt based on user role and content
function createPrompt(content: string, userRole: string): string {
  const basePrompt = `
Please structure the following work update into a professional weekly report with these sections:
1. Accomplishments - What was completed this week
2. Progress - Ongoing work that's not yet complete
3. Challenges/Blockers - Any issues that are impeding progress
4. Next Week - What will be worked on next week
5. Need Help With - Areas where assistance is needed

If any section doesn't have clear content in the input, leave it minimal rather than inventing details.
Format each section with a clear heading (## Section Title) and maintain a professional tone.
Preserve all technical details and project specifics.

Here's the content to structure:

${content}
`;

  // Add role-specific instructions
  let roleSpecificInstructions = '';
  
  switch (userRole) {
    case 'manager':
      roleSpecificInstructions = '\nThis report is for a manager, so focus on team accomplishments, resource allocation, and strategic planning aspects.';
      break;
    case 'designer':
      roleSpecificInstructions = '\nThis report is for a designer, so emphasize design milestones, user experience improvements, and visual aspects.';
      break;
    case 'developer':
      roleSpecificInstructions = '\nThis report is for a developer, so highlight technical achievements, code improvements, and implementation details.';
      break;
    case 'marketing':
      roleSpecificInstructions = '\nThis report is for a marketing professional, so focus on campaign results, content creation, and audience engagement metrics.';
      break;
    default:
      roleSpecificInstructions = '';
  }

  return basePrompt + roleSpecificInstructions;
}

// Helper function to extract potential tasks from the content
async function extractTasks(content: string): Promise<string[]> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a task extraction specialist. Identify clear action items, todos, and next steps from the provided content. Return ONLY the tasks in a JSON array format. Each task should be a clear, actionable item."
        },
        {
          role: "user",
          content: `Extract tasks from this content: ${content}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    // Parse the JSON response
    const responseContent = completion.choices[0].message.content;
    const parsedResponse = JSON.parse(responseContent || '{"tasks":[]}');
    
    return Array.isArray(parsedResponse.tasks) ? parsedResponse.tasks : [];
  } catch (error) {
    console.error('Task extraction error:', error);
    return [];
  }
} 
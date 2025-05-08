import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { v4 as uuidv4 } from 'uuid';

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
    const { 
      draftContent, 
      structuredContent, 
      tasks = [], 
      title = `Weekly Report - ${new Date().toISOString().split('T')[0]}` 
    } = body;
    
    if (!structuredContent) {
      return NextResponse.json(
        { error: 'No report content provided' },
        { status: 400 }
      );
    }

    // Generate a unique report ID
    const reportId = uuidv4();
    const timestamp = new Date().toISOString();
    
    // Here you would save the report to your database
    // This is a placeholder for actual database saving logic
    const finalizedReport = {
      id: reportId,
      userId,
      title,
      content: draftContent,
      structuredContent,
      tasks,
      status: 'finalized',
      createdAt: timestamp,
      updatedAt: timestamp,
      reportId
    };
    
    // In a real implementation, you would add database code here
    // For example: await db.reports.create({ data: finalizedReport });
    
    console.log('Finalized report:', finalizedReport);
    
    return NextResponse.json({
      success: true,
      report: finalizedReport
    });
  } catch (error: any) {
    console.error('Report finalization error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to finalize report' },
      { status: 500 }
    );
  }
} 
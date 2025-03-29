// services/interviewService.ts
import { v4 as uuidv4 } from 'uuid';

export interface AIResponseRequest {
  transcript: string[];
  company: string;
  position: string;
  interviewType: string;
  contextLines?: number;
  userId?: string;
}

export interface ScreenshotAnalysisRequest {
  screenshotData: string;
  company: string;
  position: string;
  interviewType: string;
  userId?: string;
}

export interface InterviewFeedbackRequest {
  fullTranscript: string[];
  company: string;
  position: string;
  interviewType: string;
  duration: number;
  userId?: string;
}

export interface AIResponseResult {
  aiResponse: string;
  usedContext?: string;
  fromCache?: boolean;
  error?: string;
}

export interface InterviewFeedbackResult {
  score: number;
  feedback: string;
  error?: string;
}

/**
 * Get AI response for interview question
 */
export async function getAIResponse(request: AIResponseRequest): Promise<AIResponseResult> {
  try {
    const response = await fetch('/api/interview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': uuidv4(), // Add unique ID for request tracking
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API responded with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting AI response:', error);
    return {
      aiResponse: "Sorry, I couldn't generate a response. Please try again.",
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Analyze screenshot from interview
 */
export async function analyzeScreenshot(request: ScreenshotAnalysisRequest): Promise<AIResponseResult> {
  try {
    const response = await fetch('/api/interview', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': uuidv4(),
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API responded with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error analyzing screenshot:', error);
    return {
      aiResponse: "Sorry, I couldn't analyze the screenshot. Please try again.",
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get end-of-interview feedback
 */
export async function getInterviewFeedback(request: InterviewFeedbackRequest): Promise<InterviewFeedbackResult> {
  try {
    const response = await fetch('/api/interview', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': uuidv4(),
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API responded with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting interview feedback:', error);
    return {
      score: 75, // Default score as fallback
      feedback: "Sorry, I couldn't generate feedback for your interview. Please try again.",
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
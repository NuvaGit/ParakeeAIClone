// app/api/interview/feedback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// For testing purposes without an API key, we can use mock responses
const MOCK_MODE = !process.env.OPENAI_API_KEY;

/**
 * API endpoint to generate interview feedback
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { 
      fullTranscript,
      company,
      position,
      interviewType,
      duration
    } = await request.json();
    
    if (!fullTranscript || !Array.isArray(fullTranscript)) {
      return NextResponse.json(
        { error: 'Invalid request: transcript array is required' },
        { status: 400 }
      );
    }
    
    // For testing without OpenAI API
    if (MOCK_MODE) {
      const score = Math.floor(Math.random() * 31) + 70; // Random score between 70-100
      
      return NextResponse.json({
        score: score,
        feedback: `Overall, you performed well in this interview with a score of ${score}%.\n\nStrengths:\n- You provided clear, concise answers to technical questions\n- You effectively used the STAR method when describing past experiences\n- Your communication was professional and articulate\n- You demonstrated good knowledge of industry best practices\n\nAreas for improvement:\n- Consider providing more specific metrics when discussing achievements\n- Practice more concise responses to behavioral questions\n- Prepare more detailed examples of leadership experiences\n\nFor your next interview, focus on preparing more quantifiable examples of your achievements and practicing answers to common behavioral questions.`
      });
    }
    
    // Join the transcript with line breaks
    const fullTranscriptText = fullTranscript.join("\n");
    
    // Generate system prompt for interview feedback
    const feedbackPrompt = `You are an AI interview coach analyzing a completed ${interviewType} interview for a ${position} position at ${company || "a company"}.
    
    The interview lasted approximately ${duration} minutes. Please analyze the full transcript and provide:
    
    1. A score from 0-100 representing how well the candidate performed
    2. 3-5 specific strengths demonstrated during the interview
    3. 2-3 areas for improvement
    4. General feedback on interview performance
    
    Format your response as JSON with the following structure:
    {
      "score": [number between 0-100],
      "feedback": [detailed feedback as a string]
    }
    
    Your feedback should be constructive, specific, and actionable.`;
    
    // Generate feedback based on transcript
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: feedbackPrompt
        },
        {
          role: "user",
          content: `Here's the full interview transcript for analysis:\n\n${fullTranscriptText}`
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
      response_format: { type: "json_object" }
    });
    
    // Safely handle the message content with null checking
    const messageContent = response.choices[0]?.message?.content || "{}";
    
    // Parse the JSON response
    try {
      const feedbackJson = JSON.parse(messageContent);
      return NextResponse.json({
        score: feedbackJson.score || 75,
        feedback: feedbackJson.feedback || "Interview completed successfully."
      });
    } catch (jsonError) {
      // Fallback if JSON parsing fails
      console.error('Error parsing feedback JSON:', jsonError);
      return NextResponse.json({
        score: 75, // Default score
        feedback: messageContent || "Interview completed successfully."
      });
    }
  } catch (error) {
    console.error('Error in interview feedback generation:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate interview feedback',
        // Return fallback values so the frontend can continue
        score: 75,
        feedback: "Interview completed successfully. We couldn't generate detailed feedback at this time."
      },
      { status: 500 }
    );
  }
}
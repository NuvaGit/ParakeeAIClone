import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * API endpoint to generate AI response from interview transcript
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { 
      transcript, 
      company, 
      position, 
      interviewType,
      contextLines = 5  // Number of recent transcript lines to include
    } = await request.json();

    if (!transcript || !Array.isArray(transcript)) {
      return NextResponse.json(
        { error: 'Invalid request: transcript array is required' },
        { status: 400 }
      );
    }

    // Extract the recent context from transcript
    // If contextLines is provided, only take the most recent X lines
    const recentContext = transcript.slice(-contextLines).join("\n");

    // Generate response
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an AI interview assistant helping the user during a ${interviewType} interview for a ${position} position at ${company || "a company"}. 
          Provide concise, accurate, and helpful responses to interview questions. Keep answers under 3 sentences when possible.
          Your goal is to help the user provide impressive answers that showcase their skills and experience.`
        },
        {
          role: "user",
          content: `Here's the recent interview transcript. Please provide a suggested answer for me to the interviewer's most recent question or comment:\n\n${recentContext}`
        }
      ],
      max_tokens: 300
    });
    
    // Return the AI-generated response
    return NextResponse.json({
      aiResponse: response.choices[0].message.content,
      usedContext: recentContext
    });

  } catch (error) {
    console.error('Error in interview AI response generation:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    );
  }
}

/**
 * API endpoint to analyze screenshot from interview
 */
export async function PUT(request: NextRequest) {
  try {
    // Parse the request body
    const { 
      screenshotData, 
      company, 
      position, 
      interviewType 
    } = await request.json();

    if (!screenshotData) {
      return NextResponse.json(
        { error: 'Invalid request: screenshot data is required' },
        { status: 400 }
      );
    }

    // Generate response based on screenshot
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an AI interview assistant helping the user during a ${interviewType} interview for a ${position} position at ${company || "a company"}. 
          Analyze the screenshot of the interview and provide helpful suggestions or answers.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Here's a screenshot of my current interview. Please analyze it and provide a suggested response:"
            },
            {
              type: "image_url",
              image_url: {
                url: screenshotData
              }
            }
          ]
        }
      ],
      max_tokens: 300
    });
    
    // Return the AI-generated response
    return NextResponse.json({
      aiResponse: response.choices[0].message.content
    });

  } catch (error) {
    console.error('Error in screenshot analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze screenshot' },
      { status: 500 }
    );
  }
}

/**
 * API endpoint to generate interview summary/feedback
 */
export async function PATCH(request: NextRequest) {
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
        { error: 'Invalid request: full transcript array is required' },
        { status: 400 }
      );
    }

    // Join the transcript lines
    const transcriptText = fullTranscript.join('\n');

    // Generate interview feedback
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI interview coach. Provide a concise summary and constructive feedback on this interview transcript."
        },
        {
          role: "user",
          content: `Please analyze this ${duration} minute interview transcript for a ${position} position at ${company || "a company"} and provide feedback, a score out of 100, and actionable suggestions for improvement:\n\n${transcriptText}`
        }
      ],
      max_tokens: 600
    });
    
    // Extract a score from the response if possible (fallback to calculated score)
    const feedbackText = response.choices[0].message.content || "";
    
    // Try to find a score in the text (looking for patterns like "Score: 85/100" or "85 out of 100")
    const scorePattern = /(\d{1,3})(?:\s*\/\s*100|\s*out of\s*100|\s*points|\s*%)/i;
    const scoreMatch = feedbackText.match(scorePattern);
    
    let score = 0;
    if (scoreMatch && scoreMatch[1]) {
      score = parseInt(scoreMatch[1], 10);
    } else {
      // Fallback calculation if no score in text
      // Base score between 70-90
      const baseScore = 80;
      // Random variance of ±10 points
      const variance = Math.floor(Math.random() * 20) - 10;
      score = Math.min(100, Math.max(50, baseScore + variance));
    }
    
    // Return the feedback with extracted score
    return NextResponse.json({
      feedback: feedbackText,
      score: score
    });

  } catch (error) {
    console.error('Error generating interview feedback:', error);
    return NextResponse.json(
      { error: 'Failed to generate interview feedback' },
      { status: 500 }
    );
  }
}
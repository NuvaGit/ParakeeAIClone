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
// app/api/interview/feedback/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * API endpoint to generate feedback for completed interviews
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { 
      fullTranscript, 
      company, 
      position, 
      interviewType,
      duration,
      cvContent  // Optional CV content
    } = await request.json();

    if (!fullTranscript || !Array.isArray(fullTranscript)) {
      return NextResponse.json(
        { error: 'Invalid request: transcript array is required' },
        { status: 400 }
      );
    }

    // Create system prompt
    let systemPrompt = `You are an expert interview coach, analyzing a completed ${interviewType} interview for a ${position} position at ${company || "a company"}. 
    The interview lasted approximately ${duration} minutes. Analyze the transcript and provide helpful feedback with a numeric score.
    Be constructive, focusing on both strengths and areas for improvement.`;

    // Add CV content to system prompt if available
    if (cvContent) {
      systemPrompt += `\n\nHere is the candidate's CV/resume information to help you provide more tailored feedback based on how well they presented their experience:
      ${cvContent.substring(0, 2000)}`;  // Limit CV content to avoid token limits
    }

    // Generate feedback
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Here's the full interview transcript. Please provide a score (0-100) and constructive feedback on how the interview went:\n\n${fullTranscript.join("\n")}`
        }
      ],
      temperature: 0.7,
      max_tokens: 600
    });
    
    const feedbackContent = response.choices[0].message.content || "";
    
    // Extract a score from the feedback (between 0-100)
    let score = 75; // Default score
    const scoreMatch = feedbackContent.match(/(\d{1,3})\/100|score:?\s*(\d{1,3})|(\d{1,3})\s*points|rating:?\s*(\d{1,3})/i);
    
    if (scoreMatch) {
      // Find the first non-undefined capturing group that contains a number
      const extractedScore = scoreMatch.slice(1).find(match => match !== undefined);
      if (extractedScore) {
        const parsedScore = parseInt(extractedScore, 10);
        if (!isNaN(parsedScore) && parsedScore >= 0 && parsedScore <= 100) {
          score = parsedScore;
        }
      }
    }
    
    // Return the feedback and score
    return NextResponse.json({
      feedback: feedbackContent,
      score: score
    });

  } catch (error) {
    console.error('Error generating interview feedback:', error);
    return NextResponse.json(
      { error: 'Failed to generate interview feedback', feedback: "We couldn't analyze your interview at this time.", score: 75 },
      { status: 500 }
    );
  }
}
// app/api/analyze-cv/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Parse the multipart form data
    const formData = await request.formData();
    const cvFile = formData.get('cv') as File;
    const targetRole = formData.get('targetRole') as string || '';
    
    if (!cvFile) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    // Check file size (5MB limit)
    if (cvFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max size is 5MB' }, { status: 400 });
    }
    
    // Convert the file to a format acceptable by OpenAI
    const arrayBuffer = await cvFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Create a prompt based on the target role
    const systemPrompt = `You are an expert CV/resume analyzer with deep knowledge of hiring practices across industries.
      You have helped thousands of job seekers improve their CVs and land interviews.
      When analyzing a CV, be thorough but constructive, focusing on actionable improvements.
      ${targetRole ? `The applicant is targeting a ${targetRole} role.` : ''}
      Format your response as a valid JSON object with the following structure:
      {
        "overview": "A concise summary of the CV's strengths and weaknesses (2-3 sentences)",
        "strengths": ["Strength 1", "Strength 2", "Strength 3"],
        "improvements": ["Improvement 1", "Improvement 2", "Improvement 3"],
        "atsScore": 85,
        "atsCompatibility": "Brief explanation of ATS compatibility issues and suggestions",
        "keywordSuggestions": ["Keyword 1", "Keyword 2"],
        "recommendedActions": ["Action 1", "Action 2", "Action 3"]
      }`;

    // Call OpenAI API with the file contents
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Please analyze this CV/resume." },
            {
              type: "image_url",
              image_url: {
                url: `data:${cvFile.type};base64,${buffer.toString('base64')}`,
              },
            },
          ],
        },
      ],
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });
    
    // Parse the response
    let analysisResult;
    try {
      analysisResult = JSON.parse(response.choices[0].message.content || '{}');
    } catch (err) {
      console.error('Error parsing OpenAI response:', err);
      analysisResult = {
        overview: "We encountered an issue analyzing your CV. Please try again later.",
        strengths: ["Your CV was successfully uploaded"],
        improvements: ["Please try again or contact support if the issue persists"]
      };
    }
    
    return NextResponse.json(analysisResult);
    
  } catch (error) {
    console.error('CV analysis error:', error);
    return NextResponse.json({ 
      error: 'An unexpected error occurred while processing your request' 
    }, { status: 500 });
  }
}
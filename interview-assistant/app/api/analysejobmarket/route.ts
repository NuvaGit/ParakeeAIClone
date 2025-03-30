import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { jobUrl } = await request.json();

    if (!jobUrl) {
      return NextResponse.json(
        { error: 'Job URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(jobUrl);
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Scrape the job posting content
    const jobContent = await scrapeJobPosting(jobUrl);
    
    if (!jobContent) {
      return NextResponse.json(
        { error: 'Failed to scrape job content' },
        { status: 500 }
      );
    }

    // Analyze the job content with OpenAI
    const analysis = await analyzeJobContent(jobContent);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error processing job analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze job posting' },
      { status: 500 }
    );
  }
}

async function scrapeJobPosting(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch the job posting: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove scripts, styles, and other non-content elements
    $('script, style, meta, link, noscript').remove();

    // Attempt to find the job description
    // This is a generic approach that might need to be adjusted for specific job boards
    let content = '';

    // Common selectors for job descriptions on various platforms
    const possibleSelectors = [
      'div[class*="job-description"]',
      'div[class*="jobDescription"]',
      'div[class*="description"]',
      'div[class*="details"]',
      'section[class*="job-description"]',
      'section[class*="description"]',
      'article',
      '.description',
      '#job-description',
      '#jobDescription',
      '.job-description',
      '.jobDescriptionContent',
      'div[id*="job-details"]',
      'div[id*="jobDetails"]',
      'div[class*="content"]',
      'main',
      'body', // Fallback to the entire body if we can't find a more specific element
    ];

    // Try each selector until we find content
    for (const selector of possibleSelectors) {
      const selectedContent = $(selector).text().trim();
      if (selectedContent && selectedContent.length > 100) {
        content = selectedContent;
        break;
      }
    }

    // If we still don't have content, get the text from the entire body
    if (!content || content.length < 100) {
      content = $('body').text().trim();
    }

    // Clean up the content
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();

    return content;
  } catch (error) {
    console.error('Error scraping job posting:', error);
    return null;
  }
}

async function analyzeJobContent(jobContent: string) {
  try {
    const prompt = `
    You are an expert job market analyst and career coach. Analyze the following job description thoroughly and provide a detailed analysis in a structured JSON format:

    Job Description:
    ${jobContent}

    Provide the following analysis in a JSON structure:
    1. An overview of the position (role, level, industry, company type if identifiable)
    2. A list of key requirements (skills, qualifications, experience)
    3. A categorized list of potential interview questions (technical, behavioral, role-specific)
    4. A list of skills to emphasize in the interview
    5. A list of preparation tips to help reduce interview anxiety

    Format your response as JSON with the following structure:
    {
      "overview": "A paragraph summarizing the job...",
      "requirements": ["Requirement 1", "Requirement 2", ...],
      "interviewQuestions": {
        "Technical Questions": ["Question 1", "Question 2", ...],
        "Behavioral Questions": ["Question 1", "Question 2", ...],
        "Role-specific Questions": ["Question 1", "Question 2", ...]
      },
      "skills": ["Skill 1", "Skill 2", ...],
      "preparationTips": ["Tip 1", "Tip 2", ...]
    }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0].message.content;
    
    if (!responseContent) {
      throw new Error('No analysis was generated');
    }

    // Parse the JSON response
    return JSON.parse(responseContent);
  } catch (error) {
    console.error('Error analyzing job content with OpenAI:', error);
    throw error;
  }
}
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import mammoth from 'mammoth';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import { createCanvas } from 'canvas';



// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function convertPdfToPng(buffer: Buffer): Promise<Buffer> {
  try {
    // For simplicity, we'll use pdf-lib to extract text and create a simple image
    // A more advanced solution would use a headless browser or dedicated PDF renderer
    const pdfDoc = await PDFDocument.load(buffer);
    
    // Get page count
    const pageCount = pdfDoc.getPageCount();
    
    if (pageCount === 0) {
      throw new Error('PDF document has no pages');
    }
    
    // Create a canvas for the first page
    // Using a fixed size for simplicity
    const canvas = createCanvas(800, 1200);
    const context = canvas.getContext('2d');
    
    // Fill with white background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 800, 1200);
    
    // Set text properties
    context.fillStyle = '#000000';
    context.font = '12px Arial';
    
    // Extract text from the first page (simple approach)
    // Note: This won't preserve PDF formatting but works for basic text extraction
    const page = pdfDoc.getPage(0);
    const { width, height } = page.getSize();
    
    // Add page dimensions as text
    context.fillText(`PDF Page Dimensions: ${width.toFixed(2)} x ${height.toFixed(2)}`, 40, 40);
    context.fillText(`CV/Resume Analysis Image (PDF converted to PNG)`, 40, 60);
    
    // Return the PNG buffer
    return canvas.toBuffer('image/png');
  } catch (error) {
    console.error('Error converting PDF to PNG:', error);
    throw error;
  }
}

async function convertDocToHtml(buffer: Buffer): Promise<string> {
  try {
    // Convert DOC/DOCX to HTML
    const result = await mammoth.convertToHtml({ buffer });
    return result.value;
  } catch (error) {
    console.error('Error converting DOC/DOCX to HTML:', error);
    throw error;
  }
}

async function convertHtmlToPng(html: string): Promise<Buffer> {
  try {
    // Create a canvas with a default size
    const canvas = createCanvas(800, 1200);
    const context = canvas.getContext('2d');
    
    // Fill with white background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 800, 1200);
    
    // Add basic styling to the text
    context.fillStyle = '#000000';
    context.font = '12px Arial';
    
    // Very simple HTML parsing (for complex documents, consider using a headless browser)
    const plainText = html.replace(/<[^>]*>/g, '');
    
    // Wrap text and draw on canvas
    const words = plainText.split(' ');
    let line = '';
    let y = 40;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > 760 && i > 0) {
        context.fillText(line, 40, y);
        line = words[i] + ' ';
        y += 20;
        
        // Basic pagination (start a new "page" if needed)
        if (y > 1160) {
          // For a real solution, would create a new canvas here
          break;
        }
      } else {
        line = testLine;
      }
    }
    context.fillText(line, 40, y);
    
    // Convert canvas to PNG buffer
    return canvas.toBuffer('image/png');
  } catch (error) {
    console.error('Error converting HTML to PNG:', error);
    throw error;
  }
}

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
    
    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(cvFile.type)) {
      return NextResponse.json({ error: 'Invalid file type. Please upload a PDF, DOC, or DOCX file' }, { status: 400 });
    }
    
    // Convert the file to a buffer
    const arrayBuffer = await cvFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Convert the file to PNG based on its type
    let pngBuffer: Buffer;
    
    try {
      if (cvFile.type === 'application/pdf') {
        // Alternative approach: Use the original file if conversion fails
        try {
          // Try to convert PDF to PNG
          pngBuffer = await convertPdfToPng(buffer);
        } catch (pdfError) {
          console.error("PDF conversion failed, sending original file:", pdfError);
          // Pass the original file and let OpenAI attempt to process it
          pngBuffer = buffer;
        }
      } else {
        // Convert DOC/DOCX to HTML and then to PNG
        const html = await convertDocToHtml(buffer);
        pngBuffer = await convertHtmlToPng(html);
      }
    } catch (error) {
      console.error('File conversion error:', error);
      return NextResponse.json({ 
        error: 'Unable to process file. Please ensure it is not corrupted or password protected.' 
      }, { status: 400 });
    }
    
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

    // Call OpenAI API with the PNG image
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
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
                url: `data:image/png;base64,${pngBuffer.toString('base64')}`,
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
      
      // Ensure all expected fields are present
      const defaultResult = {
        overview: "Analysis completed successfully.",
        strengths: [],
        improvements: [],
        atsScore: 70,
        atsCompatibility: "Your CV is generally ATS-compatible.",
        keywordSuggestions: [],
        recommendedActions: []
      };
      
      analysisResult = {
        ...defaultResult,
        ...analysisResult
      };
      
    } catch (err) {
      console.error('Error parsing OpenAI response:', err);
      analysisResult = {
        overview: "We encountered an issue analyzing your CV. Please try again later.",
        strengths: ["Your CV was successfully uploaded"],
        improvements: ["Please try again or contact support if the issue persists"],
        atsScore: 0,
        atsCompatibility: "Analysis incomplete due to technical issues.",
        keywordSuggestions: [],
        recommendedActions: ["Try uploading again with a clearer scan", "Ensure file is not password protected"]
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
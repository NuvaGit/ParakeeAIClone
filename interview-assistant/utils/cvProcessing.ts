// utils/cvProcessing.ts

import * as mammoth from 'mammoth';

interface CVData {
  fileName: string;
  fileSize: number;
  content?: string;
  uploadedAt: Date;
}

/**
 * Extract text content from different document types
 */
export async function extractCVContent(file: File): Promise<string> {
  const fileType = file.type;
  const buffer = await file.arrayBuffer();
  
  // Process different file types
  if (fileType === 'text/plain') {
    // Plain text files
    return new TextDecoder().decode(buffer);
  } 
  else if (fileType === 'application/pdf') {
    // For PDFs, we would typically use a library like pdf.js
    // This is a placeholder for PDF extraction
    throw new Error('PDF processing not implemented in this browser version');
  } 
  else if (
    fileType === 'application/msword' || 
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    // For Word documents, using mammoth.js
    try {
      // Use the buffer directly without converting to Uint8Array
      const result = await mammoth.extractRawText({ arrayBuffer: buffer });
      return result.value;
    } catch (error) {
      console.error('Error extracting text from Word document:', error);
      throw new Error('Failed to process Word document');
    }
  } 
  else {
    throw new Error(`Unsupported file type: ${fileType}`);
  }
}

/**
 * Process a CV file and return structured CV data
 */
export async function processCVFile(file: File): Promise<CVData> {
  try {
    // Validate file type
    const validTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      'text/plain'
    ];
    
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a PDF, DOC, DOCX, or TXT file');
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File too large. Maximum file size is 5MB');
    }
    
    // Extract content
    let content = '';
    
    try {
      content = await extractCVContent(file);
    } catch (error) {
      // Fallback for unsupported file types in browser
      content = `Content extraction not fully supported for ${file.type} in browser. Please use text or Word files for best results.`;
    }
    
    // Return structured CV data
    return {
      fileName: file.name,
      fileSize: file.size,
      content: content,
      uploadedAt: new Date()
    };
  } catch (error) {
    console.error('Error processing CV file:', error);
    throw error;
  }
}

/**
 * Prepare CV content for API usage
 * Trims and formats CV content to be used in API calls
 */
export function prepareCVForAPI(cvData: CVData | null): string | null {
  if (!cvData || !cvData.content) {
    return null;
  }
  
  let content = cvData.content.trim();
  
  // Truncate if too long to manage token usage in API calls
  const maxLength = 5000;
  if (content.length > maxLength) {
    content = content.substring(0, maxLength) + '... [content truncated for API usage]';
  }
  
  return content;
}
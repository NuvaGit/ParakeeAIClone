// firebase/interviews.ts
import { db } from './config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp, 
  FieldValue,
  FirestoreError,
  Firestore,
  writeBatch
} from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

// Type assertion to ensure db is recognized as Firestore type
const firestore: Firestore = db;

// Define interview types for better type checking
export const INTERVIEW_TYPES = ["Technical Interview", "Behavioral Interview", "Case Interview", "General Interview"] as const;
export type InterviewType = typeof INTERVIEW_TYPES[number];

export interface InterviewQuestion {
  question: string;
  answer: string;
  aiSuggestion?: string;
}

export interface InterviewData {
  userId: string;
  company: string;
  position: string;
  interviewType?: InterviewType;
  date: Timestamp | Date | FieldValue;
  status: 'in-progress' | 'completed';
  duration?: string;
  aiUsage?: number;
  score?: number;
  feedback?: string;
  transcript?: string;
  questions?: InterviewQuestion[];
}

export interface Interview extends InterviewData {
  id: string;
}

export interface CreateInterviewData {
  company: string;
  position: string;
  interviewType?: InterviewType;
}

/**
 * Helper function to get error message from unknown error
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

/**
 * Helper function to detect offline errors
 */
function isOfflineError(error: unknown): boolean {
  if (error instanceof FirebaseError) {
    return error.code === 'unavailable' || error.code === 'failed-precondition';
  }
  
  if (error instanceof FirestoreError) {
    return error.code === 'unavailable' || error.code === 'failed-precondition';
  }
  
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const errorMsg = (error as { message: unknown }).message;
    if (typeof errorMsg === 'string') {
      return errorMsg.includes('offline') || errorMsg.includes('network');
    }
  }
  
  return false;
}

/**
 * Helper to sanitize data before sending to Firestore
 */
function sanitizeData(data: any): any {
  if (data === null || data === undefined) {
    return null;
  }
  
  if (typeof data !== 'object') {
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }
  
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    // Skip undefined values as Firestore doesn't support them
    if (value !== undefined) {
      result[key] = sanitizeData(value);
    }
  }
  
  return result;
}

/**
 * Create a new interview session
 */
export async function createInterviewSession(userId: string, data: CreateInterviewData): Promise<string> {
  let retryCount = 0;
  const MAX_RETRIES = 3;
  
  console.log("Creating interview session for user:", userId);
  console.log("Interview data:", JSON.stringify(data));
  
  // Validate required fields
  if (!userId || userId.trim() === '') {
    console.error("Invalid userId provided");
    throw new Error('userId is required');
  }
  
  while (retryCount < MAX_RETRIES) {
    try {
      // Create sanitized interview data
      const interviewData: InterviewData = sanitizeData({
        userId,
        company: data.company || "Practice Interview",
        position: data.position || "General Interview",
        interviewType: data.interviewType || 'General Interview',
        date: Timestamp.now(),
        status: 'in-progress',
        questions: []
      });
      
      console.log("Sanitized interview data:", JSON.stringify(interviewData));
      
      // Use a batch write for better atomicity
      const batch = writeBatch(firestore);
      const interviewsRef = collection(firestore, 'interviews');
      const newDocRef = doc(interviewsRef);
      
      batch.set(newDocRef, interviewData);
      
      console.log("Committing batch with new interview document...");
      await batch.commit();
      
      console.log("Interview session created successfully with ID:", newDocRef.id);
      return newDocRef.id;
    } catch (error: unknown) {
      retryCount++;
      console.error(`Error creating interview session (attempt ${retryCount}/${MAX_RETRIES}):`, error);
      
      if (retryCount >= MAX_RETRIES) {
        console.error("Max retries reached. Final error:", error);
        throw new Error(`Failed to create interview session: ${getErrorMessage(error)}`);
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  throw new Error('Failed to create interview session after multiple attempts');
}

/**
 * Add a question to an interview session
 */
export async function addInterviewQuestion(interviewId: string, question: InterviewQuestion): Promise<void> {
  try {
    console.log(`Adding question to interview ${interviewId}:`, JSON.stringify(question));
    
    // Sanitize question data first
    const sanitizedQuestion = sanitizeData(question);
    
    const interviewRef = doc(firestore, 'interviews', interviewId);
    const interviewSnapshot = await getDoc(interviewRef);
    
    if (!interviewSnapshot.exists()) {
      throw new Error('Interview not found');
    }
    
    const interviewData = interviewSnapshot.data() as InterviewData;
    const questions = interviewData.questions || [];
    
    // Use a batch write for robustness
    const batch = writeBatch(firestore);
    
    batch.update(interviewRef, {
      questions: [...questions, sanitizedQuestion],
      updatedAt: Timestamp.now()
    });
    
    await batch.commit();
    console.log("Question added successfully");
  } catch (error: unknown) {
    console.error('Error adding interview question:', error);
    throw error;
  }
}

/**
 * Complete an interview session with results
 */
export async function completeInterviewSession(
  interviewId: string, 
  results: { 
    duration: string; 
    aiUsage: number; 
    score: number; 
    feedback: string;
    transcript: string;
  }
): Promise<void> {
  let retryCount = 0;
  const MAX_RETRIES = 3;
  
  console.log(`Completing interview ${interviewId} with results:`, JSON.stringify(results));
  
  // Sanitize results first
  const sanitizedResults = sanitizeData({
    status: 'completed',
    duration: results.duration,
    aiUsage: results.aiUsage,
    score: results.score,
    feedback: results.feedback,
    transcript: results.transcript,
    completedAt: Timestamp.now()
  });
  
  while (retryCount < MAX_RETRIES) {
    try {
      const interviewRef = doc(firestore, 'interviews', interviewId);
      
      // Use a batch for atomic update
      const batch = writeBatch(firestore);
      batch.update(interviewRef, sanitizedResults);
      
      await batch.commit();
      console.log("Interview completed successfully");
      return;
    } catch (error: unknown) {
      retryCount++;
      console.error(`Error completing interview (attempt ${retryCount}/${MAX_RETRIES}):`, error);
      
      if (retryCount >= MAX_RETRIES) {
        console.error("Max retries reached. Final error:", error);
        throw new Error(`Failed to complete interview: ${getErrorMessage(error)}`);
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

/**
 * Get a list of user's interviews
 */
export async function getUserInterviews(userId: string): Promise<Interview[]> {
  try {
    console.log(`Getting interviews for user ${userId}`);
    
    const interviewsQuery = query(
      collection(firestore, 'interviews'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(interviewsQuery);
    console.log(`Found ${querySnapshot.docs.length} interviews`);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Interview[];
  } catch (error: unknown) {
    console.error('Error getting user interviews:', error);
    throw error;
  }
}

/**
 * Get a specific interview by ID
 */
export async function getInterviewById(interviewId: string): Promise<Interview | null> {
  try {
    console.log(`Getting interview by ID: ${interviewId}`);
    
    const interviewRef = doc(firestore, 'interviews', interviewId);
    const docSnapshot = await getDoc(interviewRef);
    
    if (!docSnapshot.exists()) {
      console.log(`Interview ${interviewId} not found`);
      return null;
    }
    
    console.log(`Interview ${interviewId} found, returning data`);
    return {
      id: docSnapshot.id,
      ...docSnapshot.data()
    } as Interview;
  } catch (error: unknown) {
    console.error('Error getting interview by ID:', error);
    throw error;
  }
}

/**
 * Get user's average interview score
 */
export async function getUserAverageScore(userId: string): Promise<number> {
  try {
    console.log(`Calculating average score for user ${userId}`);
    
    const interviewsQuery = query(
      collection(firestore, 'interviews'),
      where('userId', '==', userId),
      where('status', '==', 'completed')
    );
    
    const querySnapshot = await getDocs(interviewsQuery);
    
    if (querySnapshot.empty) {
      console.log('No completed interviews found');
      return 0;
    }
    
    let totalScore = 0;
    let count = 0;
    
    querySnapshot.forEach(doc => {
      const data = doc.data();
      if (data.score) {
        totalScore += data.score;
        count++;
      }
    });
    
    const average = count > 0 ? Math.round(totalScore / count) : 0;
    console.log(`Average score: ${average} from ${count} interviews`);
    return average;
  } catch (error: unknown) {
    console.error('Error calculating average score:', error);
    return 0;
  }
}

/**
 * Get common questions from user's interviews
 */
export async function getCommonQuestions(userId: string): Promise<string[]> {
  try {
    console.log(`Getting common questions for user ${userId}`);
    
    const interviewsQuery = query(
      collection(firestore, 'interviews'),
      where('userId', '==', userId),
      where('status', '==', 'completed')
    );
    
    const querySnapshot = await getDocs(interviewsQuery);
    
    if (querySnapshot.empty) {
      console.log('No completed interviews found');
      return [];
    }
    
    // Map to track question frequency
    const questionCounts = new Map<string, number>();
    
    // Collect all questions
    querySnapshot.forEach(doc => {
      const data = doc.data() as InterviewData;
      
      if (data.questions && Array.isArray(data.questions)) {
        data.questions.forEach(q => {
          const questionText = q.question.trim();
          
          if (questionText) {
            const count = questionCounts.get(questionText) || 0;
            questionCounts.set(questionText, count + 1);
          }
        });
      }
    });
    
    // Convert to array, sort by frequency, and take top 5
    const commonQuestions = Array.from(questionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);
      
    console.log(`Found ${commonQuestions.length} common questions`);
    return commonQuestions;
  } catch (error: unknown) {
    console.error('Error getting common questions:', error);
    return [];
  }
}
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
  serverTimestamp, 
  FieldValue 
} from 'firebase/firestore';

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
  date: Timestamp | Date | FieldValue;  // Updated to include FieldValue type
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
 * Create a new interview session
 */
export async function createInterviewSession(userId: string, data: CreateInterviewData): Promise<string> {
  try {
    // Create new interview document
    const interviewData: InterviewData = {
      userId,
      company: data.company,
      position: data.position,
      interviewType: data.interviewType || 'General Interview',
      date: serverTimestamp(),  // This now works with updated type
      status: 'in-progress',
      questions: []
    };
    
    const docRef = await addDoc(collection(db, 'interviews'), interviewData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating interview session:', error);
    throw error;
  }
}

/**
 * Add a question to an interview session
 */
export async function addInterviewQuestion(interviewId: string, question: InterviewQuestion): Promise<void> {
  try {
    const interviewRef = doc(db, 'interviews', interviewId);
    const interviewSnapshot = await getDoc(interviewRef);
    
    if (!interviewSnapshot.exists()) {
      throw new Error('Interview not found');
    }
    
    const interviewData = interviewSnapshot.data() as InterviewData;
    const questions = interviewData.questions || [];
    
    // Add the new question
    await updateDoc(interviewRef, {
      questions: [...questions, question]
    });
  } catch (error) {
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
  try {
    const interviewRef = doc(db, 'interviews', interviewId);
    
    await updateDoc(interviewRef, {
      status: 'completed',
      duration: results.duration,
      aiUsage: results.aiUsage,
      score: results.score,
      feedback: results.feedback,
      transcript: results.transcript
    });
  } catch (error) {
    console.error('Error completing interview session:', error);
    throw error;
  }
}

/**
 * Get a list of user's interviews
 */
export async function getUserInterviews(userId: string): Promise<Interview[]> {
  try {
    const interviewsQuery = query(
      collection(db, 'interviews'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(interviewsQuery);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Interview[];
  } catch (error) {
    console.error('Error getting user interviews:', error);
    throw error;
  }
}

/**
 * Get a specific interview by ID
 */
export async function getInterviewById(interviewId: string): Promise<Interview | null> {
  try {
    const interviewRef = doc(db, 'interviews', interviewId);
    const docSnapshot = await getDoc(interviewRef);
    
    if (!docSnapshot.exists()) {
      return null;
    }
    
    return {
      id: docSnapshot.id,
      ...docSnapshot.data()
    } as Interview;
  } catch (error) {
    console.error('Error getting interview by ID:', error);
    throw error;
  }
}

/**
 * Get user's average interview score
 */
export async function getUserAverageScore(userId: string): Promise<number> {
  try {
    const interviewsQuery = query(
      collection(db, 'interviews'),
      where('userId', '==', userId),
      where('status', '==', 'completed')
    );
    
    const querySnapshot = await getDocs(interviewsQuery);
    
    if (querySnapshot.empty) {
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
    
    return count > 0 ? Math.round(totalScore / count) : 0;
  } catch (error) {
    console.error('Error calculating average score:', error);
    return 0;
  }
}

/**
 * Get common questions from user's interviews
 */
export async function getCommonQuestions(userId: string): Promise<string[]> {
  try {
    const interviewsQuery = query(
      collection(db, 'interviews'),
      where('userId', '==', userId),
      where('status', '==', 'completed')
    );
    
    const querySnapshot = await getDocs(interviewsQuery);
    
    if (querySnapshot.empty) {
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
    return Array.from(questionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);
  } catch (error) {
    console.error('Error getting common questions:', error);
    return [];
  }
}
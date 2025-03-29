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
  Firestore // Import Firestore type
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
 * Helper function to detect offline errors
 */
function isOfflineError(error: any): boolean {
  return (
    (error instanceof FirebaseError && 
     (error.code === 'unavailable' || 
      error.code === 'failed-precondition')) ||
    (error instanceof FirestoreError && 
     (error.code === 'unavailable' || 
      error.code === 'failed-precondition')) ||
    (error.message && 
     typeof error.message === 'string' && 
     (error.message.includes('offline') || 
      error.message.includes('network')))
  );
}

/**
 * Create a new interview session
 */
export async function createInterviewSession(userId: string, data: CreateInterviewData): Promise<string> {
  let retryCount = 0;
  const MAX_RETRIES = 3;
  
  while (retryCount < MAX_RETRIES) {
    try {
      // Check network connectivity before attempting
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('Cannot create interview session while offline');
      }
      
      // Create new interview document with explicit Timestamp
      // Using Timestamp.now() instead of serverTimestamp for better offline behavior
      const interviewData: InterviewData = {
        userId,
        company: data.company,
        position: data.position,
        interviewType: data.interviewType || 'General Interview',
        date: Timestamp.now(),
        status: 'in-progress',
        questions: []
      };
      
      console.log("Creating interview session in Firestore...");
      const docRef = await addDoc(collection(firestore, 'interviews'), interviewData);
      console.log("Interview session created with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      retryCount++;
      console.error(`Error creating interview session (attempt ${retryCount}/${MAX_RETRIES}):`, error);
      
      if (retryCount >= MAX_RETRIES) {
        if (isOfflineError(error)) {
          throw new Error('Failed to create interview session because you are offline. Please check your internet connection and try again.');
        }
        throw error;
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
    const interviewRef = doc(firestore, 'interviews', interviewId);
    const interviewSnapshot = await getDoc(interviewRef);
    
    if (!interviewSnapshot.exists()) {
      throw new Error('Interview not found');
    }
    
    const interviewData = interviewSnapshot.data() as InterviewData;
    const questions = interviewData.questions || [];
    
    // Add the new question
    await updateDoc(interviewRef, {
      questions: [...questions, question],
      updatedAt: Timestamp.now() // Add timestamp for when it was updated
    });
  } catch (error) {
    console.error('Error adding interview question:', error);
    
    // If it's an offline error, store in localStorage as backup and continue
    if (isOfflineError(error) && typeof localStorage !== 'undefined') {
      console.warn('Unable to save question due to network issues - saving locally');
      try {
        const key = `interview_question_backup_${interviewId}`;
        const existingData = localStorage.getItem(key);
        const backupQuestions = existingData ? JSON.parse(existingData) : [];
        backupQuestions.push({
          ...question,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem(key, JSON.stringify(backupQuestions));
        return; // Continue without throwing
      } catch (storageError) {
        console.error("Failed to backup to localStorage:", storageError);
      }
    }
    
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
  
  while (retryCount < MAX_RETRIES) {
    try {
      const interviewRef = doc(firestore, 'interviews', interviewId);
      
      await updateDoc(interviewRef, {
        status: 'completed',
        duration: results.duration,
        aiUsage: results.aiUsage,
        score: results.score,
        feedback: results.feedback,
        transcript: results.transcript,
        completedAt: Timestamp.now() // Add explicit timestamp for completion time
      });
      
      console.log("Interview completed successfully");
      return;
    } catch (error) {
      retryCount++;
      console.error(`Error completing interview (attempt ${retryCount}/${MAX_RETRIES}):`, error);
      
      if (retryCount >= MAX_RETRIES) {
        if (isOfflineError(error) && typeof localStorage !== 'undefined') {
          // Store in localStorage for later synchronization
          console.warn('Unable to save to Firebase - saving to local storage');
          try {
            localStorage.setItem(`interview_backup_${interviewId}`, JSON.stringify({
              interviewId,
              results,
              timestamp: new Date().toISOString()
            }));
            console.log("Interview results backed up locally");
            return; // Continue without throwing
          } catch (storageError) {
            console.error("Failed to backup to localStorage:", storageError);
          }
        }
        
        throw error;
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
    const interviewsQuery = query(
      collection(firestore, 'interviews'),
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
    
    // If offline, try to retrieve any locally backed up interviews
    if (isOfflineError(error) && typeof localStorage !== 'undefined') {
      console.log('Attempting to retrieve backup interviews from local storage');
      const backupInterviews: Interview[] = [];
      
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith('interview_backup_')) {
            const data = localStorage.getItem(key);
            if (data) {
              try {
                const backup = JSON.parse(data);
                if (backup.interviewId) {
                  backupInterviews.push({
                    id: backup.interviewId,
                    userId,
                    company: backup.results?.company || 'Offline Backup',
                    position: backup.results?.position || 'Unavailable',
                    date: new Date(backup.timestamp),
                    status: 'completed',
                    ...backup.results
                  } as Interview);
                }
              } catch (parseError) {
                console.error('Error parsing backup:', parseError);
              }
            }
          }
        }
        
        if (backupInterviews.length > 0) {
          console.log(`Retrieved ${backupInterviews.length} backup interviews`);
          return backupInterviews;
        }
      } catch (localStorageError) {
        console.error('Error accessing localStorage:', localStorageError);
      }
    }
    
    throw error;
  }
}

/**
 * Get a specific interview by ID
 */
export async function getInterviewById(interviewId: string): Promise<Interview | null> {
  try {
    const interviewRef = doc(firestore, 'interviews', interviewId);
    const docSnapshot = await getDoc(interviewRef);
    
    if (!docSnapshot.exists()) {
      // Before returning null, check localStorage for backup
      if (typeof localStorage !== 'undefined') {
        const backup = localStorage.getItem(`interview_backup_${interviewId}`);
        if (backup) {
          try {
            const data = JSON.parse(backup);
            console.log('Found backed-up interview in localStorage');
            return {
              id: interviewId,
              userId: 'unknown', // We don't know the userId from backup
              company: data.results?.company || 'Offline Backup',
              position: data.results?.position || 'Unavailable',
              date: new Date(data.timestamp),
              status: 'completed',
              ...data.results
            } as Interview;
          } catch (parseError) {
            console.error('Error parsing backup:', parseError);
          }
        }
      }
      
      return null;
    }
    
    return {
      id: docSnapshot.id,
      ...docSnapshot.data()
    } as Interview;
  } catch (error) {
    console.error('Error getting interview by ID:', error);
    
    // Check localStorage if offline
    if (isOfflineError(error) && typeof localStorage !== 'undefined') {
      const backup = localStorage.getItem(`interview_backup_${interviewId}`);
      if (backup) {
        try {
          const data = JSON.parse(backup);
          return {
            id: interviewId,
            userId: 'unknown',
            company: data.results?.company || 'Offline Backup',
            position: data.results?.position || 'Unavailable',
            date: new Date(data.timestamp),
            status: 'completed',
            ...data.results
          } as Interview;
        } catch (parseError) {
          console.error('Error parsing backup:', parseError);
        }
      }
    }
    
    throw error;
  }
}

/**
 * Get user's average interview score
 */
export async function getUserAverageScore(userId: string): Promise<number> {
  try {
    const interviewsQuery = query(
      collection(firestore, 'interviews'),
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
      collection(firestore, 'interviews'),
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
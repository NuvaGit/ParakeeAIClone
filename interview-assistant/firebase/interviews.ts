import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    Timestamp,
    DocumentData,
    serverTimestamp
  } from 'firebase/firestore';
  import { db } from './config';
  import { getUserDocuments, getDocumentsWhere } from './firestore';
  
  // Interview types
  export interface Interview {
    id?: string;
    userId: string;
    company: string;
    position: string;
    date: Timestamp | Date;
    duration: string;
    aiUsage: number;
    score: number;
    feedback?: string;
    transcript?: string; // Add transcript property
    questions?: InterviewQuestion[];
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
  }
  
  export interface InterviewQuestion {
    id?: string;
    interviewId: string;
    question: string;
    answer: string;
    aiSuggestion?: string;
    score?: number;
    timestamp?: Timestamp;
  }
  
  // Create a new interview session
  export const createInterviewSession = async (userId: string, data: {
    company: string;
    position: string;
  }): Promise<string> => {
    try {
      const interviewData: Omit<Interview, 'id'> = {
        userId,
        company: data.company,
        position: data.position,
        date: serverTimestamp() as Timestamp,
        duration: '0 minutes',
        aiUsage: 0,
        score: 0,
        feedback: '',
        questions: []
      };
      
      const docRef = await addDoc(collection(db, 'interviews'), interviewData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating interview session:', error);
      throw error;
    }
  };
  
  // Get a specific interview by ID
  export const getInterview = async (interviewId: string): Promise<Interview | null> => {
    try {
      const docRef = doc(db, 'interviews', interviewId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Interview;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting interview:', error);
      throw error;
    }
  };
  
  // Get all interviews for a user
  export const getUserInterviews = async (userId: string): Promise<Interview[]> => {
    try {
      return await getUserDocuments('interviews', userId, 'date', 'desc') as Interview[];
    } catch (error) {
      console.error('Error getting user interviews:', error);
      throw error;
    }
  };
  
  // Update an interview session
  export const updateInterviewSession = async (
    interviewId: string, 
    data: Partial<Interview>
  ): Promise<void> => {
    try {
      const docRef = doc(db, 'interviews', interviewId);
      const updateData = {
        ...data,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating interview session:', error);
      throw error;
    }
  };
  
  // End an interview and record final details
  export const completeInterviewSession = async (
    interviewId: string,
    data: {
      duration: string;
      aiUsage: number;
      score: number;
      feedback?: string;
      transcript?: string; // Make transcript optional
    }
  ): Promise<void> => {
    try {
      await updateInterviewSession(interviewId, {
        ...data,
        date: serverTimestamp() as Timestamp // Update the date to when it was completed
      });
    } catch (error) {
      console.error('Error completing interview session:', error);
      throw error;
    }
  };
  
  // Add a question to an interview
  export const addInterviewQuestion = async (
    interviewId: string,
    questionData: Omit<InterviewQuestion, 'id' | 'interviewId' | 'timestamp'>
  ): Promise<string> => {
    try {
      const question: Omit<InterviewQuestion, 'id'> = {
        interviewId,
        ...questionData,
        timestamp: serverTimestamp() as Timestamp
      };
      
      const docRef = await addDoc(collection(db, 'questions'), question);
      
      // Also update the aiUsage count on the interview
      const interview = await getInterview(interviewId);
      if (interview) {
        const aiUsage = (interview.aiUsage || 0) + (questionData.aiSuggestion ? 1 : 0);
        await updateInterviewSession(interviewId, { aiUsage });
      }
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding interview question:', error);
      throw error;
    }
  };
  
  // Get all questions for an interview
  export const getInterviewQuestions = async (interviewId: string): Promise<InterviewQuestion[]> => {
    try {
      return await getDocumentsWhere(
        'questions',
        'interviewId',
        '==',
        interviewId,
        'timestamp',
        'asc'
      ) as InterviewQuestion[];
    } catch (error) {
      console.error('Error getting interview questions:', error);
      throw error;
    }
  };
  
  // Get user's average interview score
  export const getUserAverageScore = async (userId: string): Promise<number> => {
    try {
      const interviews = await getUserInterviews(userId);
      
      if (interviews.length === 0) {
        return 0;
      }
      
      const totalScore = interviews.reduce((sum, interview) => sum + interview.score, 0);
      return Math.round(totalScore / interviews.length);
    } catch (error) {
      console.error('Error calculating average score:', error);
      throw error;
    }
  };
  
  // Get common questions across all interviews
  export const getCommonQuestions = async (userId: string, limit: number = 5): Promise<string[]> => {
    try {
      // This would ideally involve more complex aggregation
      // For now, we'll just get the most recent questions as a placeholder
      const interviews = await getUserInterviews(userId);
      const interviewIds = interviews.map(interview => interview.id!);
      
      // Get all questions from these interviews
      const allQuestions: InterviewQuestion[] = [];
      
      for (const interviewId of interviewIds) {
        const questions = await getInterviewQuestions(interviewId);
        allQuestions.push(...questions);
      }
      
      // In a real implementation, you would count and sort by frequency
      // For now, just return the most recent ones
      return allQuestions
        .sort((a, b) => {
          if (!a.timestamp || !b.timestamp) return 0;
          return (b.timestamp as any).seconds - (a.timestamp as any).seconds;
        })
        .slice(0, limit)
        .map(q => q.question);
    } catch (error) {
      console.error('Error getting common questions:', error);
      throw error;
    }
  };
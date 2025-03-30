import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryConstraint,
  Timestamp,
  addDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';

// Helper to sanitize data before Firestore operations
function sanitizeData(data: any): any {
  if (data === null || data === undefined) {
    return null;
  }
  
  if (typeof data !== 'object') {
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item)).filter(item => item !== undefined);
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

// Create a new document with a custom ID
export const createDocumentWithId = async (
  collectionName: string,
  id: string,
  data: DocumentData
) => {
  console.log(`Creating document in ${collectionName} with ID ${id}`);
  const docRef = doc(db, collectionName, id);
  
  const sanitizedData = sanitizeData({
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  
  try {
    await setDoc(docRef, sanitizedData);
    console.log(`Document created successfully in ${collectionName} with ID ${id}`);
    return docRef;
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw error;
  }
};

// Create a new document with auto-generated ID
export const createDocument = async (
  collectionName: string,
  data: DocumentData
) => {
  console.log(`Creating document in ${collectionName} with auto-generated ID`);
  
  const sanitizedData = sanitizeData({
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  
  try {
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, sanitizedData);
    console.log(`Document created successfully in ${collectionName} with ID ${docRef.id}`);
    return docRef;
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw error;
  }
};

// Read a document
export const getDocument = async (collectionName: string, id: string) => {
  console.log(`Getting document from ${collectionName} with ID ${id}`);
  
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log(`Document found in ${collectionName} with ID ${id}`);
      return { id: docSnap.id, ...docSnap.data() };
    }
    
    console.log(`Document not found in ${collectionName} with ID ${id}`);
    return null;
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw error;
  }
};

// Update a document
export const updateDocument = async (
  collectionName: string,
  id: string,
  data: Partial<DocumentData>
) => {
  console.log(`Updating document in ${collectionName} with ID ${id}`);
  
  const sanitizedData = sanitizeData({
    ...data,
    updatedAt: Timestamp.now()
  });
  
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, sanitizedData);
    console.log(`Document updated successfully in ${collectionName} with ID ${id}`);
    return docRef;
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (collectionName: string, id: string) => {
  console.log(`Deleting document from ${collectionName} with ID ${id}`);
  
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    console.log(`Document deleted successfully from ${collectionName} with ID ${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
};

// Query documents
export const queryDocuments = async (
  collectionName: string,
  constraints: QueryConstraint[] = []
) => {
  console.log(`Querying documents from ${collectionName} with ${constraints.length} constraints`);
  
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    console.log(`Query returned ${querySnapshot.docs.length} documents from ${collectionName}`);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error querying documents from ${collectionName}:`, error);
    throw error;
  }
};

// Commonly used queries
export const getDocumentsWhere = async (
  collectionName: string,
  field: string,
  operator: '==' | '!=' | '>' | '>=' | '<' | '<=',
  value: any,
  orderByField?: string,
  orderDirection?: 'asc' | 'desc',
  limitCount?: number
) => {
  console.log(`Getting documents from ${collectionName} where ${field} ${operator} ${value}`);
  
  const constraints: QueryConstraint[] = [where(field, operator, value)];
  
  if (orderByField) {
    constraints.push(orderBy(orderByField, orderDirection || 'asc'));
  }
  
  if (limitCount) {
    constraints.push(limit(limitCount));
  }
  
  return queryDocuments(collectionName, constraints);
};

// Get user's documents
export const getUserDocuments = async (
  collectionName: string,
  userId: string,
  orderByField: string = 'createdAt',
  orderDirection: 'asc' | 'desc' = 'desc'
) => {
  console.log(`Getting ${userId}'s documents from ${collectionName} ordered by ${orderByField} ${orderDirection}`);
  
  return getDocumentsWhere(
    collectionName, 
    'userId', 
    '==', 
    userId,
    orderByField,
    orderDirection
  );
};
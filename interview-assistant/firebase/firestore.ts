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
    addDoc
  } from 'firebase/firestore';
  import { db } from './config';
  
  // Create a new document with a custom ID
  export const createDocumentWithId = async (
    collectionName: string,
    id: string,
    data: DocumentData
  ) => {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef;
  };
  
  // Create a new document with auto-generated ID
  export const createDocument = async (
    collectionName: string,
    data: DocumentData
  ) => {
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef;
  };
  
  // Read a document
  export const getDocument = async (collectionName: string, id: string) => {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    
    return null;
  };
  
  // Update a document
  export const updateDocument = async (
    collectionName: string,
    id: string,
    data: Partial<DocumentData>
  ) => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
    return docRef;
  };
  
  // Delete a document
  export const deleteDocument = async (collectionName: string, id: string) => {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    return true;
  };
  
  // Query documents
  export const queryDocuments = async (
    collectionName: string,
    constraints: QueryConstraint[] = []
  ) => {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
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
    return getDocumentsWhere(
      collectionName, 
      'userId', 
      '==', 
      userId,
      orderByField,
      orderDirection
    );
  };